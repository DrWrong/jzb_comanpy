from django import forms
from jzb.utils import requestsdk

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()

    def login(self, request):
        res = requestsdk.login(self.cleaned_data)
        if res["status"] == "no":
            return False
        else:
            request.session["is_login"] = True
            # print(res['data'][]))
            request.session["userId"] = res['data']["userID"]
            request.session["enterpriseId"] = res['data']['enterpriseId']
            return True


class RegisterForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()
    password_again = forms.CharField()

    def clean_password(self):
        password = self.cleaned_data.get("password", "")
        password_again = self.cleaned_data.get("password_again", "")
        if password != password_again:
            raise forms.ValidationError("前后密码不一致")
        return password

    def register(self, request):
        res = requestsdk.register(self.cleaned_data)
        # print(res)
        if res['status'] == "ok":
            request.session["is_login"] = True
            # print(type(res['data']))
            request.session["userId"] = res['data']["userID"]
            return (True, '')
        else:
            return (False, res['msg'])


class EnterpriseInfoForm(forms.Form):
    name = forms.CharField()
    name_abb = forms.CharField()
    city = forms.CharField()
    address_detail = forms.CharField(required=False)
    scale = forms.IntegerField()
    qq = forms.CharField()
    email = forms.EmailField()
    property = forms.IntegerField()
    about = forms.CharField()
    website = forms.CharField(required=False)
    phone = forms.CharField()
    contact = forms.CharField()
    logo = forms.ImageField()
    business_license = forms.ImageField()
    # user_id = forms.IntegerField(required=False)
    code = forms.CharField(required=False)

    # def get_form_kwargs(self):
    #     kwargs = super()

    def __init__(self, sceniro, user_id=0, *args, **kwargs):
        self.sceniro = sceniro
        self.user_id = user_id
        return super(EnterpriseInfoForm, self).__init__(*args, **kwargs)
