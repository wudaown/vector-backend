#!/bin/bash

set -u


if [ "$#" -ne 4 ]; then
    echo 'Usage: install.sh <SERVER IP> <USERNAME> <PASSWORD> <EMAIL>'
    echo 'Example: install 172.21.0.1/24 admin admin admin@admin.com'
    exit 1
fi

USER=$(whoami)

echo "Install docker"
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce -y

sudo gpasswd -a $USER docker

docker stop vector
docker rm vector
docker build . -t vector

DIST_VERSION=$(lsb_release -r -s)

echo 'Disable firewall'
sudo systemctl disable ufw
sudo systemctl stop ufw

echo 'Install wireguard'
if [ $DIST_VERSION != "20.04" ]; then
	sudo apt install software-properties-common -y
	# Add repo
	sudo add-apt-repository ppa:wireguard/wireguard -y
fi
# Update cache
sudo apt update 
# Install wireguard -y
sudo apt install wireguard net-tools -y

echo 'Allow non root user to execute wg and wg-quick'
WG=$(which wg)
WGQUICK=$(which wg-quick)
sudo su -c "echo $USER ALL=\(ALL\) NOPASSWD: $WG >> /etc/sudoers"
sudo su -c "echo $USER ALL=\(ALL\) NOPASSWD: $WGQUICK >> /etc/sudoers"


echo 'Enable ip forwarding'
sudo su -c  "echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf"
sudo sysctl -p /etc/sysctl.conf
sudo sysctl -w net.ipv4.ip_forward=1

docker create --name vector  --network host --cap-add NET_ADMIN  -p 8000:8000 -v /home/wudaown/wg:/app/wireguard_conf  -v /usr/bin/wg:/usr/bin/wg -v /usr/bin/wg-quick:/usr/bin/wg-quick -e VECTOR_SERVER_IP=$1 -e USERNAME=$2 -e EMAIL=$4 -e PASSWD=$3 vector

docker start vector

echo 'Give user permission for wg0.conf'
sudo chown $USER:$USER $HOME/wg

sudo ln -s $HOME/wg/wg0.conf /etc/wireguard/wg0.conf

echo 'Enable wireguard as a service'
sudo systemctl enable wg-quick@wg0

echo 'Start wireguard service'
sudo systemctl start wg-quick@wg0
