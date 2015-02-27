from django.views.generic import TemplateView, FormView
from jzb.utils import requestsdk
from django.conf import settings

class IndexView(TemplateView):
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

class ListView(TemplateView):
    template_name = "jzb/list.html"

    def get_context_data(self, **kwargs):
        kwargs = super(ListView, self).get_context_data(**kwargs)
        jobslist_prams = {
            "page_size": settings.HOTJOB_PAGESIZE,
            'start_index': 0,
            'rank_dimension': self.request.GET.get("rank_dimension", "new")
        }
        datas = requestsdk.jobslist(jobslist_prams)
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
                jobslist_prams["start_index"] = current_page * settings.HOTJOB_PAGESIZE
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



class JobEditView(TemplateView):
    template_name = "bianjizhiwei.html"





# class LoginView
