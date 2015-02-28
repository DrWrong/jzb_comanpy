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
            # print(request.session["userId"])
            request.session["enterpriseId"] = res['data']['enterpriseID']
            return True


class RegisterForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()
    password_again = forms.CharField()

    def clean(self):
        password = self.cleaned_data.get("password", "")
        password_again = self.cleaned_data.get("password_again", "")
        # print(password)
        # print(password_again)
        if password != password_again:
            raise forms.ValidationError("前后密码不一致")
        return self.cleaned_data

    def register(self, request):
        res = requestsdk.register(self.cleaned_data)
        print(res)
        if res['status'] == "ok":
            request.session["is_login"] = True
            # print(type(res['data']))
            request.session["userId"] = res['data']["userID"]
            return (True, '')
        else:
            return (False, res['msg'])


class PartTimeJobForm(forms.Form):
    category = forms.IntegerField()
    title = forms.CharField()
    salary = forms.CharField()
    salary_unit = forms.IntegerField()
    number = forms.CharField(required=False)
    address = forms.CharField(required=False)
    city = forms.CharField(required=False)
    district = forms.CharField(required=False)
    end_time = forms.CharField(required=False)
    contact = forms.CharField(required=False)
    phone = forms.CharField()
    qq = forms.CharField()
    # working_time = forms.CharField()
    # working_requirement = forms.CharField()
    working_content = forms.CharField()

    man_read_unit = {
        1: "元/小时",
        2: "元/天",
        3: "元/月",
        4: "元/(次,单)"
    }

    def __init__(self, sceniro, jobid, enterpriseId, *args, **kwargs):
        self.sceniro = sceniro
        self.jobid = jobid
        self.enterpriseId = enterpriseId
        return super(PartTimeJobForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super(PartTimeJobForm, self).clean()
        salary = cleaned_data.get("salary", "")
        salary_unit = cleaned_data.pop("salary_unit", 0)
        salary_unit = self.man_read_unit.get(salary_unit, '')
        cleaned_data["salary"] = salary + salary_unit
        address = cleaned_data.get("address", "")
        city = cleaned_data.get("city", '')
        district = cleaned_data.get("district", '')
        cleaned_data['address'] = address + city + district
        return cleaned_data

    def do_create_or_update(self):
        data = self.cleaned_data
        data["enterprise_id"] = self.enterpriseId
        if self.sceniro == "create":
            res = requestsdk.create_job(data)
            print(res)
        else:
            res = requestsdk.update_job(self.jobid, data)
            print(res)
        return res


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
    logo = forms.ImageField(required=False)
    business_license = forms.ImageField(required=False)
    # user_id = forms.IntegerField(required=False)
    code = forms.CharField(required=False)

    # def get_form_kwargs(self):
    #     kwargs = super()

    def __init__(self, sceniro, user_id=0, *args, **kwargs):
        self.sceniro = sceniro
        self.user_id = user_id
        return super(EnterpriseInfoForm, self).__init__(*args, **kwargs)

    def do_create_or_update(self):
        data = self.cleaned_data
        # print(help(data["logo"]))
        if self.sceniro == "create":
            data["user_id"] = self.user_id
            return requestsdk.do_create(data)

