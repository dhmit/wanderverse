"""

Production settings for *****

"""

from .base import *  # pylint: disable=unused-wildcard-import, wildcard-import

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECRET_KEY = os.environ['DJANGO_SECRET_KEY']  # set in venv activate

ADMINS = [('Aizman', 'aizman@mit.edu')]

ALLOWED_HOSTS = ["w.dhlab.mit.edu"]

CORS_ORIGIN_WHITELIST = []
