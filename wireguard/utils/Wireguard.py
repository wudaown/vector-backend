import os
from invoke import run
from ..models import Client

from wireguard.constants import CLIENT_CONFIG_DIR, SERVER_CONFIG, CLIENT_TEMPLATE, PEER_TEMPLATE


class Wireguard:
    def __init__(self, *args, **kwargs):
        self.server_conf = SERVER_CONFIG

    def genkey_client(self):
        cmd = "wg genkey | tee privatekey | wg pubkey > publickey"
        run(cmd, hide=True)
        cmd = 'cat privatekey && rm privatekey'
        client_private_key = run(cmd, hide=True).stdout.strip()
        cmd = 'cat publickey && rm publickey'
        client_public_key = run(cmd, hide=True).stdout.strip()
        return client_private_key, client_public_key

    def create(self, client,  server, ip_range):
        ip = client.ip
        device = client.device
        platform = client.platform
        client_private_key = client.private_key
        server_wan_ip = server.wan_ip
        server_port = server.port
        server_public_key = server.public_key
        endpoint = '{}:{}'.format(server_wan_ip, server_port)
        with open(CLIENT_TEMPLATE) as fh:
            client_template = fh.read()
        client_conf = client_template.replace('#PRIVATEKEY', client_private_key).replace(
            "#IPADDR", ip).replace('#PUBLICKEY', server_public_key).replace('#ALLOWIP', ip_range).replace(
                '#ENDPOINT', endpoint)
        client_conf_name = '{}_{}.conf'.format(device, platform)
        client_config = os.path.join(CLIENT_CONFIG_DIR, client_conf_name)
        with open(client_config, 'w') as fh:
            fh.write(client_conf)

    def delete(self, instance):
        fh = open(self.server_conf, 'r')
        content = fh.read()
        removal = self.construct(instance.public_key, instance.ip)
        content = content.replace(removal, '')
        with open(self.server_conf, 'w') as fh:
            fh.write(content)
        filename = f"{instance.device}_{instance.platform}.conf"
        path = os.path.join(CLIENT_CONFIG_DIR, filename)
        run(f"rm {path}", hide=True)
        cmd = f'sudo wg set wg0 peer {instance.public_key} remove'
        run(cmd, hide=True)

    def construct(self, public_key, ip):
        ip = ip.replace('/24', '/32')
        removal = f"[Peer]\nPublicKey = {public_key}\nAllowedIPs = {ip}"
        return removal

    def update_server(self, instance):
        pk = instance.pk
        client_public_key = instance.public_key
        client_ip_range = instance.ip
        client_ip_range = client_ip_range.replace('/24', '/32')
        with open(PEER_TEMPLATE) as fh:
            peer_template = fh.read()
        peer_conf = peer_template.replace('#PUBLICKEY', client_public_key).replace(
            '#IPADDR', client_ip_range)
        with open(self.server_conf, 'a') as fh:
            fh.write(peer_conf)
        cmd = f'sudo wg set wg0 peer {client_public_key} allowed-ips
        {client_ip_range}'
        # TODO
        # log addition of client
        run(cmd, hide=True)
