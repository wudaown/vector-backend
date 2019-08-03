import os
from .base import *

HOSTNAME = os.uname().nodename

ALLOWED_HOSTS = [HOSTNAME, '*']
# cors
CORS_ORIGIN_ALLOW_ALL = True

# CORS_ALLOW_WHITELIST = [
#     HOSTNAME,
#     'http://192.168.0.20'
# ]

CORS_ALLOW_CREDENTIALS = True


# static files
STATICFILES_DIRS = (
    # os.path.join(BASE_DIR, 'static'),
    os.path.join('static'),
)
# STATIC_ROOT = 'static'
STATIC_URL = '/api/static/'

# media files
ROOT_DIR = BASE_DIR.replace('vector_backend', '', 1)
# MEDIA_ROOT = "/home/wudaown/workspace/vector_backend/wireguard_conf"
MEDIA_ROOT = os.path.join(ROOT_DIR, 'wireguard_conf')
MEDIA_URL = "media/"
