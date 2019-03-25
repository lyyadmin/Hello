'''
Created on 2017年12月5日

@author: admin
'''
from controller import base
from model import  cmodel,role,user
import json


class AppController(base.Controller):
    def get(self,v):
        if v=="":
            v = "index.html"
        self.render("app/"+v)
    def modellist(self):
        mn = self.get_escaped_argument("userName", "")
        r = role.Role.get_role(usr=mn)
        lst = cmodel.Model.model_list(modelName="", isjson=True,ro=r)
        return lst
    def getuserinfo(self):
        usr = self.get_escaped_argument("userName", "")
        ur = user.User.getuser_by_acount(usr)
        return json.dumps(ur)