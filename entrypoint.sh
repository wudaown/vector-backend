#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail
set -o xtrace
set -u

# Require environment variables.
if [ -z "${VECTOR_SERVER_IP-}" ] ; then
	echo "Environment variable VECTOR_VECTOR_SERVER_IP required. Exiting."
	exit 1
fi

if [ -z "${USERNAME-}" ] ; then
	echo "Environment variable USERNAME required. Exiting."
	exit 1
fi

if [ -z "${EMAIL-}" ] ; then
	echo "Environment variable EMAIL required. Exiting."
	exit 1
fi

if [ -z "${PASSWD-}" ] ; then
	echo "Environment variable PASSWD required. Exiting."
	exit 1
fi

FILE=/app/wireguard_conf/wg0.conf
if [ ! -f "$FILE" ]; then
	PWD=$(pwd)
	
	wg genkey | tee privatekey | wg pubkey > publickey
	
	INTERFACE=$(routel| grep default | awk '{print $NF}')
	
	PRIVATEKEY=$(cat privatekey)
	
	PUBLICKEY=$(cat publickey)
	function get_free_udp_port
	{
	    local port=$(shuf -i 2000-65000 -n 1)
	    ss -lau | grep $port > /dev/null
	    if [[ $? == 1 ]] ; then
	        echo "$port"
	    else
	        get_free_udp_port
	    fi
	}
	
	PORT=$(get_free_udp_port)
	
	WANIP=$(curl ifconfig.io)
	
	SERVER_CONFIG=wireguard_conf/wg0.conf
	CLIENT_CONFIG=wireguard_conf/client
	CLIENT_QR=wireguard_conf/qr
	
	mkdir -p ${CLIENT_CONFIG}
	mkdir -p ${CLIENT_QR}
	
	echo "
#WAN_IP ${WANIP}
#IP ${VECTOR_SERVER_IP}
#PORT ${PORT}
#PRIVATE_KEY ${PRIVATEKEY}
#PUBLIC_KEY ${PUBLICKEY}
[Interface]
Address = ${VECTOR_SERVER_IP}
MTU = 1420
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ${INTERFACE} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ${INTERFACE} -j MASQUERADE
ListenPort = ${PORT}
PrivateKey = ${PRIVATEKEY}
" >> ${SERVER_CONFIG}
	
	rm privatekey publickey
fi

function check_superuser_exists {
	EXISTS=$(echo "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.all().count())" | python manage.py shell --settings=vector_backend.settings.prod)
	if [ $EXISTS != "1" ]; then
		echo "from django.contrib.auth.models import User; User.objects.create_superuser('${USERNAME}', '${EMAIL}', '${PASSWD}')" | python manage.py shell --settings=vector_backend.settings.prod
	fi
}


python manage.py makemigrations --settings=vector_backend.settings.prod
python manage.py migrate  --settings=vector_backend.settings.prod
check_superuser_exists
python manage.py runserver 0.0.0.0:8000  --settings=vector_backend.settings.prod
