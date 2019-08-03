import os
CURRENT_DIR = os.getcwd()
CONFIG_DIR = os.path.join(CURRENT_DIR, "wireguard_conf")
CONFIG_FILE = 'wg0.conf'
SERVER_CONFIG = os.path.join(CONFIG_DIR, CONFIG_FILE)

CLIENT_CONFIG_DIR = os.path.join(CONFIG_DIR, 'client')
CLIENT_CONFIG_QR = os.path.join(CONFIG_DIR, 'qr')

CLIENT_TEMPLATE = os.path.join(CURRENT_DIR, 'template/client.conf')
PEER_TEMPLATE = os.path.join(CURRENT_DIR, 'template/peer.conf')
