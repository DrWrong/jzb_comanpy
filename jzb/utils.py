from django.conf import settings
import requests
from logging import getLogger


class RequestSDk(object):
    url_prefix = settings.API_URL

    def __init__(self):
        self.logger = getLogger("django.jzb.requestsdk")

    def request(self, method, url, data):
        func = getattr(requests, method)
        r = func(self.url_prefix + url, params=data)
        print(r.url)
        if r.status_code != 200:
            self.logger.error(r.text)
            return None

        return r.json()

    def jobslist(self, data):
        return self.request('get', '/enterprise/jobs', data)

    def login(self, data):
        return self.request('post', "/user/oauth", data)

    def register(self, data):
        return self.request('post', '/user', data)

    def get_enterprise_info(self, enterpriseId):
        return self.request('get', '/enterprise/%d' % enterpriseId)

requestsdk = RequestSDk()
