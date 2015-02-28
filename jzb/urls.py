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
    url(r'^job/(?P<jobid>\d+)$', views.JobDetailView.as_view(), name="job_detail"),
    url(r'^district/(?P<cityid>\d+)', views.CityListView.as_view(), name="city_list"),
    url(r'^citys/(?P<pid>\d+)', views.ProvinceListView.as_view()),
    # url(r'^login/$', views.LoginView.as_view(), name="login"),
    # url(r'^register/$', views.RegisterView.as_view(), name="register"),
    url(r'^admin', include(admin.site.urls)),
    url(r'^user', include("user.urls", namespace="user"))
)
