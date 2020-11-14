import os
from django.apps import AppConfig
from .constants import SERVER_CONFIG


class WireguardConfig(AppConfig):
    name = 'wireguard'

    def ready(self):
        fh = open(SERVER_CONFIG, 'r')
        ip = None
        contents = fh.readlines()
        for line in contents:
            if line.strip().startswith("#IP"):
                ip = line.strip().replace("#IP", "").strip()
                os.environ['SERVER_IP'] = ip
                break
