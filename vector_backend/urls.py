from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from wireguard.views import ClientViewsets, ServerViewset

router = routers.DefaultRouter()

router.register('client', ClientViewsets)
router.register('server', ServerViewset)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include((router.urls))),
    path('api/', include('rest_framework.urls'))

]

if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
