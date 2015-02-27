from django import forms
from jzb.utils import requestsdk
class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()

    def login(self, request):
        res = requestsdk.login(self.cleaned_data)
        if res.status == "no":
            return False
        else:
            request.session["is_login"] = True
            request.session["userId"] = data["userId"]
