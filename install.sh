#!/bin/bash

set -u

if [ "$#" -ne 1 ]; then
    echo 'Usage: install.sh <SERVER IP>'
    echo 'Example: install 172.21.0.1/24'
    exit 1
fi
SERVER_IP=$1

sudo install software-properties-common -y
# Add repo
sudo add-apt-repository ppa:wireguard/wireguard -y
# Update cache
sudo apt update 
# Install wireguard -y
sudo apt install wireguard -y

# TODO
# if conf already exists use it
# DEFAULT_CONF_DIR='/etc/wireguard/wg0.conf'
# if [ ! -d $DEFAULT_CONF_DIR ]; then
#     sudo cp DEFAULT_CONF_DIR ./wireguard_conf/wg0.conf
# fi

PWD=$(pwd)

wg genkey | tee privatekey | wg pubkey > publickey

INTERFACE=$(route | awk '/default/ {print $8}')

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

echo "#WAN_IP ${WANIP}
#IP ${SERVER_IP}
#PORT ${PORT}
#PRIVATE_KEY ${PRIVATEKEY}
#PUBLIC_KEY ${PUBLICKEY}
[Interface]
Address = ${SERVER_IP}
MTU = 1420
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ${INTERFACE} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ${INTERFACE} -j MASQUERADE
ListenPort = ${PORT}
PrivateKey = ${PRIVATEKEY}
" >> ${SERVER_CONFIG}

rm privatekey publickey

sudo ln -s $PWD/$SERVER_CONFIG /etc/wireguard/wg0.conf
