"""
URL configuration for instagram_clone project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path

try:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

    spectacular_urlpatterns = [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path(
            'api/docs/',
            SpectacularSwaggerView.as_view(url_name='schema'),
            name='swagger-ui',
        ),
    ]
except ModuleNotFoundError:
    def schema_unavailable(_request):
        return JsonResponse(
            {
                'detail': (
                    'drf-spectacular is not available in this environment. '
                    'Install it in a supported Python version to enable schema output.'
                )
            },
            status=503,
        )

    spectacular_urlpatterns = []
    spectacular_urlpatterns.append(path('api/schema/', schema_unavailable, name='schema'))
    spectacular_urlpatterns.append(path('api/docs/', schema_unavailable, name='swagger-ui'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('posts.urls')),
    path('api/', include('interactions.urls')),
    path('api/notifications/', include('notifications.urls')),
]

urlpatterns += spectacular_urlpatterns

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
