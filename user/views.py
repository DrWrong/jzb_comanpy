# from django.shortcuts import render
from django.views.generic import FormView, View
from user.forms import LoginForm, RegisterForm, EnterpriseInfoForm
from django.http import HttpResponse, JsonResponse
from django.core.urlresolvers import reverse
from jzb.utils import requestsdk


class AjaxRespondMixin(object):

    def ajax_response(self, data):
        return JsonResponse(data)


# Create your views here.
class LoginView(FormView, AjaxRespondMixin):
    template_name = "user/login.html"
    form_class = LoginForm

    def get_success_url(self):
        return reverse("user:index")

    def form_valid(self, form):
        login = form.login(self.request)
        if self.request.is_ajax():
            if not login:
                return self.ajax_response({"status": 1, "msg": "用户名或密码不正确"})
            return self.ajax_response({"status": 0, "msg": "ok"})
        if not login:
            return self.render_to_response(self.get_context_data(
                form=form, errormsg="用户名或密码不正确"))
        return super(LoginView, self).form_valid(form)


class RegisterView(FormView, AjaxRespondMixin):
    template_name = "user/register.html"
    form_class = RegisterForm

    def get_success_url(self):
        return reverse("user:enterpriseinfo")

    def form_invalid(self, form):
        return self.ajax_response({"status": 1, "msg": form.errors})

    def form_valid(self, form):
        ok, msg = form.register(self.request)
        if not ok:
            return self.render_to_response(self.get_context_data(form=form, errormsg=msg))
        return super(RegisterView, self).form_valid(form)


class EnterpriseInfoView(FormView):
    template_name = "user/wanshanziliao.html"
    form_class = EnterpriseInfoForm

    def get_form_kwargs(self):
        kwargs = super(EnterpriseInfoView, self).get_form_kwargs()
        kwargs['sceniro'] = 'create' if not self.request.user.enterpriseId else 'update'
        if self.request.method == "GET" \
           and self.request.user.enterpriseId is not None:
            kwargs['data'] = requestsdk.get_enterprise_info(
                self.request.user.enterpriseId)
        return kwargs

    def get_context_data(self, **kwargs):
        kwargs = super(EnterpriseInfoView, self).get_context_data(**kwargs)
        is_create = False if self.request.user.enterpriseId else True
        if is_create:
            kwargs['title'] = "创建企业信息"
            # kwargs['sceniro'] = 'create'
        else:
            kwargs['title'] = "更新企业信息"
        return kwargs


class UserIndexView(View):
    pass
