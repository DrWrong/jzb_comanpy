class User(object):
    pass

class AuthenticationMiddleware(object):
    """docstring for AuthenticationMiddleware"""
    def process_request(self, request):
        u = User()
        u.is_login = request.session.get("is_login", False)
        u.id = request.session.get("userId", 0)
        u.enterpriseId = request.session.get("enterpriseId")
        print(u.id)
        print(u.enterpriseId)
        request.user = u
