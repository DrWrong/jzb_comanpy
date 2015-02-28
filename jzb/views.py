from django.views.generic import TemplateView, View
from jzb.utils import requestsdk
from django.conf import settings
from user.views import AjaxRespondMixin


class JobView(TemplateView):

    def get_context_data(self, **kwargs):
        kwargs = super(JobView, self).get_context_data(**kwargs)
        divisions = requestsdk.get_divisions()
        citys = []
        if divisions is not None:
            for data in divisions["data"]:
                for city in data["citie"]:
                    citys.append({"name": city["name"], "id": city["id"]})
        kwargs["citys"] = citys
        categorys = requestsdk.get_categorys()
        kwargs['categorys'] = categorys[
            "data"] if categorys is not None else []
        return kwargs


class IndexView(JobView):
    template_name = "jzb/index.html"

    def get_context_data(self, **kwargs):
        kwargs = super(IndexView, self).get_context_data(**kwargs)
        jobslist_prams = {
            "page_size": settings.HOTJOB_PAGESIZE,
            'start_index': 0,
            'rank_dimension': self.request.GET.get("rank_dimension", "new")
        }
        datas = requestsdk.jobslist(jobslist_prams)
        if datas is not None:
            kwargs["hot_jobs"] = datas["js"]
        # print(kwargs["hot_jobs"])
        return kwargs


class ListView(JobView):
    template_name = "jzb/list.html"

    def get_context_data(self, **kwargs):
        kwargs = super(ListView, self).get_context_data(**kwargs)
        jobslist_prams = {
            "page_size": settings.HOTJOB_PAGESIZE,
            'start_index': 0,
            'rank_dimension': self.request.GET.get("rank_dimension", "new"),
            'city': self.request.GET.get("city", ""),
            'district': self.request.GET.get('district', ""),
            'job_type': self.request.GET.get('job_type', ''),
        }
        datas = requestsdk.jobslist(jobslist_prams)
        kwargs["count"] = datas["count"]
        if datas is not None:
            # kwargs["hot_jobs"] = datas["js"]
            kwargs['page_num'] = datas["count"] // 10
            # if datas['count'] % 10:
            #     kwargs['page_num'] += 1

            try:
                current_page = int(self.request.GET.get("page", 0))
            except ValueError:
                current_page = 0
            if current_page != 0:
                jobslist_prams["start_index"] = current_page * \
                    settings.HOTJOB_PAGESIZE
                datas = requestsdk.jobslist(jobslist_prams)
            kwargs["current_page"] = current_page
            kwargs['hot_jobs'] = datas['js']
        # print(kwargs["hot_jobs"])
        return kwargs

# class LoginView(FormView):
#     template_name = "login.html"
#     form_class =
    # def post(self, request, *args, **kwargs):


# class RegisterView(TemplateView):
#     template_name = "register.html"


class CityListView(View, AjaxRespondMixin):

    def get(self, request, *args, **kwargs):
        cityid = int(kwargs["cityid"])
        divisions = requestsdk.get_divisions()
        if divisions is not None:
            for data in divisions["data"]:
                for city in data["citie"]:
                    if city["id"] == cityid:
                        return self.ajax_response(city["districts"])
        return self.ajax_response([])


class ProvinceListView(View, AjaxRespondMixin):
    def get(self, request, *args, **kwargs):
        pid = int(kwargs["pid"])
        divisions = requestsdk.get_divisions()
        cities = []
        for data in divisions["data"]:
            if data["id"] == pid:
                for city in data['citie']:
                    cities.append({"id": city["id"], "value": city["name"]})
            break
        return self.ajax_response(cities)

class JobDetailView(TemplateView):
    template_name = "jzb/detail.html"

    def get_context_data(self, **kwargs):
        kwargs =  super(JobDetailView, self).get_context_data(**kwargs)
        jobid = int(kwargs["jobid"])
        job = requestsdk.get_job(jobid)
        ctype = job["type"]
        job["type"] = "其他"
        categorys = requestsdk.get_categorys()["data"]
        for category in categorys:
            if category["id"] == ctype:
                job["type"] = category["name"]
        kwargs["job"] = job

        return kwargs



# class LoginView
