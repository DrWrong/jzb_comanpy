# from django.shortcuts import render
from django.views.generic import FormView, TemplateView, View
from user.forms import LoginForm, RegisterForm, EnterpriseInfoForm, PartTimeJobForm
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from jzb.utils import requestsdk


class AjaxRespondMixin(object):

    def ajax_response(self, data):
        return JsonResponse(data, safe=False)


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


class LogoutView(View):

    def get(self, request, *args, **kwargs):
        try:
            request.session.pop("is_login")
            request.session.pop("userId")
            request.session.pop("enterpriseId")
        except KeyError:
            pass
        return HttpResponseRedirect("/")


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
    success_url = "/user/"

    def get_form_kwargs(self):
        kwargs = super(EnterpriseInfoView, self).get_form_kwargs()
        kwargs[
            'sceniro'] = 'create' if not self.request.user.enterpriseId else 'update'
        kwargs["user_id"] = self.request.user.id
        if self.request.method == "GET" \
           and self.request.user.enterpriseId is not None:
            kwargs['data'] = requestsdk.get_enterprise_info(
                self.request.user.enterpriseId)
            print(kwargs["data"])
        return kwargs

    def get_context_data(self, **kwargs):
        kwargs = super(EnterpriseInfoView, self).get_context_data(**kwargs)
        is_create = False if self.request.user.enterpriseId else True
        divisions = requestsdk.get_divisions()
        kwargs["provinces"] = []
        form = kwargs["form"]
        province_not_found = True
        for data in divisions["data"]:
            province = {"id": data["id"], "name": data["name"]}
            if is_create or (not province_not_found):
                province["selected"] = False
            else:
                kwargs["citys"] = []
                for city in data["citie"]:
                    city_dict = {"id": city["id"], "name": city["name"]}
                    if form["city"].value() == city["id"]:
                        city_dict["selected"] = True
                        province["selected"] = True
                        province_not_found = False
                    else:
                        city_dict["selected"] = False
                    kwargs["citys"].append(city_dict)

            kwargs["provinces"].append(province)
        # if not is_create:
        #     for data in divisions["data"]:
        if is_create:
            kwargs['title'] = "创建企业信息"
            # kwargs['sceniro'] = 'create'
        else:
            kwargs['title'] = "更新企业信息"
        return kwargs

    def form_valid(self, form):
        res = form.do_create_or_update()
        if res["status"] == "ok":
            self.request.session["enterpriseId"] = res['id']
            return super(EnterpriseInfoView, self).form_valid(form)
        return self.render_to_response(form, errormsg=res["msg"])


class UserIndexView(TemplateView):
    template_name = "user/guanlixinxi.html"

    def get_context_data(self, **kwargs):
        kwargs = super(UserIndexView, self).get_context_data()
        requestdata = {
            "start_index": 0,
            "page_size": 10,
        }
        datas = requestsdk.get_enterprise_jobs(
            self.request.user.enterpriseId, requestdata)
        print(datas)
        kwargs["jobs"] = datas["data"]["data"]
        return kwargs

    def get(self, request, *args, **kwargs):
        if not self.request.user.enterpriseId:
            return HttpResponseRedirect(reverse("user:enterpriseinfo"))
        return super(UserIndexView, self).get(request, *args, **kwargs)


class PublishJobView(FormView):
    template_name = "user/job.html"
    form_class = PartTimeJobForm

    def get_form_kwargs(self):
        kwargs = super(PublishJobView, self).get_form_kwargs()
        jobid = self.request.GET.get("jobid")
        self.jobdata = requestsdk.get_job(jobid) if jobid else None
        kwargs["sceniro"] = "create" if self.jobdata is None else "update"
        kwargs["jobid"] = jobid
        kwargs["enterpriseId"] = self.request.user.enterpriseId
        if self.request.method == "GET" and kwargs["sceniro"] == "update":
            kwargs["data"] = self.jobdata
        return kwargs

    def get_context_data(self, **kwargs):
        kwargs = super(PublishJobView, self).get_context_data(**kwargs)
        form = kwargs["form"]
        category_value = form['category'].value()
        kwargs["categorys"] = requestsdk.get_categorys()['data']
        for category in kwargs["categorys"]:
            if category["id"] == category_value:
                category["selected"] = True
            else:
                category['selected'] = False
        if form.sceniro == "create":
            kwargs["posturl"] = reverse("user:publishjob")
        else:
            kwargs["posturl"] = reverse(
                "user:publishjob") + "?jobid=" + self.request.GET.get("jobid")
        return kwargs

    def form_valid(self, form):
        form.do_create_or_update()
        # kwargs['sceniro'] =



class PassworeResetView(TemplateView):
    template_name = "user/passwordreset.html"


class ValidateCodeSendView(View, AjaxRespondMixin):

    def get(self, request, *args, **kwargs):
        phone = self.request.GET.get("phone")
        return self.ajax_response(requestsdk.sendvalidate(phone))
