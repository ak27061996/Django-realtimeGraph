from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
        url(r'^$', 'home.views.index', name='root_path'),
        url(r'^alert/$', 'home.views.sendData'),
        url(r'^accounts/login/$','django.contrib.auth.views.login',name='login'),
        url(r'^clear/$','home.views.remove'),
)

