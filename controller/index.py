'''
Created on 2017年12月5日

@author: admin
'''
import tornado
from model import  user
class IndexController(tornado.web.RequestHandler):
    def get(self):
        cuser = self.get_cookie("current_user", "")
        print(cuser)
        if cuser=="":
            self.render("admin/login.html")
        else:
            userinfo = user.User.getuser_by_acount(cuser)
            self.render("admin/main.html",user=userinfo)
