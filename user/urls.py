from django.conf.urls import patterns, url
from user import views

urlpatterns = patterns(
    "",
    url(r'^$', views.UserIndexView.as_view(), name="index"),
    url(r'^login$', views.LoginView.as_view(), name="login"),
    url(r'^register$', views.RegisterView.as_view(), name="register"),
    url(r'^enterpriseinfo$', views.EnterpriseInfoView.as_view(), name="enterpriseinfo")
    )
