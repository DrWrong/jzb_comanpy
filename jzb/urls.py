from django.conf.urls import patterns, include, url
from django.contrib import admin
from jzb import views
# import user

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'jzb.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.IndexView.as_view(), name="index"),
    url(r'^list/$', views.ListView.as_view(), name="list"),
    url(r'^job/edit/$', views.JobEditView.as_view(), name="job_edit"),
    # url(r'^login/$', views.LoginView.as_view(), name="login"),
    # url(r'^register/$', views.RegisterView.as_view(), name="register"),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^user/', include("user.urls", namespace="user"))
)
