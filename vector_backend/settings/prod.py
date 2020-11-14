import os
from .dev import *

DEBUG = True

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, '..', 'build', 'static'),
)
