from django.conf.urls import patterns, url
from user import views

urlpatterns = patterns(
    "",
    url(r'^/$', views.UserIndexView.as_view(), name="index"),
    url(r'^/login$', views.LoginView.as_view(), name="login"),
    url(r'^/logout$', views.LogoutView.as_view(), name="logout"),
    url(r'^/register$', views.RegisterView.as_view(), name="register"),
    url(r'^/password_reset$', views.PassworeResetView.as_view(),
        name="password_reset"),
    url(r'^/enterpriseinfo$', views.EnterpriseInfoView.as_view(),
        name="enterpriseinfo"),
    url(r'^/job$', views.PublishJobView.as_view(), name="publishjob"),
    url(r'^/phone$', views.ValidateCodeSendView.as_view(),
        name="validatecodesend"),
)
