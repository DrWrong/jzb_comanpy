from django.conf import settings
import requests
from logging import getLogger


class RequestSDk(object):
    url_prefix = settings.API_URL
    general_url_prefix = settings.COMMON_API_URL

    def __init__(self):
        self.logger = getLogger("django.jzb.requestsdk")

    def request(self, method, url, data=None, files=None):
        func = getattr(requests, method)
        r = func(self.url_prefix + url, params=data, files=files)
        print(r.url)
        if r.status_code != 200:
            self.logger.error(r.text)
            return None
        # print(r.text)
        return r.json()

    def jobslist(self, data):
        return self.request('get', '/enterprise/jobs', data)

    def login(self, data):
        return self.request('post', "/user/oauth", data)

    def register(self, data):
        return self.request('post', '/user', data)

    def get_enterprise_info(self, enterpriseId):
        return self.request('get', '/enterprise/%d' % enterpriseId)

    def get_divisions(self):
        '''TODO: add cache to this function '''
        r = requests.get(self.general_url_prefix + "/divisions")
        if r.status_code != 200:
            self.logger.error(r.text)
            return None
        return r.json()

    def get_categorys(self):
        r = requests.get(self.general_url_prefix + "/categorys")
        if r.status_code != 200:
            self.logger.error(r.text)
            return None
        return r.json()

    def sendvalidate(self, phone):
        return self.request(
            'get', '/enterprise/verification-code', {"phone": phone})

    def do_create(self, data):
        logo = data.pop("logo", None)
        business_license = data.pop("business_license", None)
        files = {}
        if logo is not None:
            # logo.open("rb")
            files["logo"] = logo
        if business_license is not None:
            # print(help(business_license))
            files["business_license"] = business_license
        return self.request(
            'post', '/enterprise/add', data, files)

    def get_enterprise_jobs(self, eid, data):
        return self.request('get', '/enterprise/jobs/%d' % eid, data)

    def get_job(self, jobid):
        return self.request('get', '/job/%s' % jobid)

    def create_job(self, data):
        return self.request(
            'post', '/job', data)

    def update_job(self, jobid, data):
        return self.request(
            'post', 'job/%d' % int(jobid), data)

requestsdk = RequestSDk()
