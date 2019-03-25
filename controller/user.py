'''
Created on 2017年12月5日

@author: admin
'''
import time
import json

import uuid
from controller import base
from model import  user, role, cache


class UserController(base.Controller):
    def verification(self):
        response = {}
        ac = self.get_escaped_argument("username", "default")
        pwd = self.get_escaped_argument("password", "default")
        lst = user.User.exist(acount=ac,password=pwd);
        if len(lst)>0:
            usr = lst[0]
            print(usr)
            if usr['enabled']==1:
                self.set_cookie("current_user", ac)
                cu = user.User.getuser_by_acount(ac)
                cache.Cache.set(ac+"last_login_time", str(cu['login_time']))
                cache.Cache.set(ac+"last_login_host", str(cu['login_host']))
                user.User.update_login_status(cu,int(time.time()),self.getip())
                response["status"] = "1"
                response["message"] = "login success !"
                response["data"] = user.User.getuser(ac, pwd)
            else:
                self.set_cookie("current_user", "")
                response["status"] = "0"
                response["message"] = "该账户已被管理员停用!"
                response["data"] = {}
        else:
            self.set_cookie("current_user", "")
            response["status"] = "0"
            response["message"] = "账号或密码错误 !"
            response["data"] = {}
        return json.dumps(response)
    def admins(self):
        sd = self.get_escaped_argument("sdate", "")
        ed = self.get_escaped_argument("edate", "")
        ac = self.get_escaped_argument("adminName", "")
        wh = "where isadmin=0"
        if ac != "":
            wh+=" and login_name='"+ac+"'"
        if sd != "":
            if wh == "":
                wh+=" where"
            else:
                wh+=" and"
            sd = time.mktime(time.strptime(sd,'%Y-%m-%d'))
            wh+=" create_time>="+str(sd)
        if ed != "":
            if wh == "":
                wh+=" where"
            else:
                wh+=" and"
            ed = time.mktime(time.strptime(str(ed)+" 23:59:59",'%Y-%m-%d %H:%M:%S'))
            wh+=" create_time<="+str(ed)
        users = user.User.list_data(where=wh)
        for ur in users:
            ur['role_name'] = role.Role.getRolebyid(ur['role_id'])['role_name']
        data = {}
        data['count'] = len(users)
        data['data'] = users 
        return json.dumps(data)
    def adminadd(self):
        response = {}
        action = self.get_escaped_argument("action", "")
        ac = self.get_escaped_argument("adminName", "")
        userinfo = user.User.getuser_by_acount(ac)
        if action == "addadmin" and userinfo["msg"] == "yes":
            response["status"] = "0"
            response["msg"] = "用户名已存在！"
        else:
            pwd = self.get_escaped_argument("pwd", "")
            username = self.get_escaped_argument("userName", "")
            sex = self.get_escaped_argument("sex", "")
            email = self.get_escaped_argument("email", "")
            phone = self.get_escaped_argument("phone", "")
            adminRole = self.get_escaped_argument("adminRole", "")
            marks = self.get_escaped_argument("marks", "")
            tm = int(time.time())
            enabled = 1
            if action == "addadmin":
                uid = str(uuid.uuid3(uuid.NAMESPACE_DNS, ac))
                T = ("",ac,pwd,uid,username,sex,phone,email,enabled,marks,tm,tm,adminRole,tm,self.getip())
                res = str(user.User.insert_user_kv(T))
                response["status"] = res
                response["msg"] = "添加成功!"
            else:
                if userinfo["login_name"]==ac:
                    T = ("",ac,pwd,username,sex,phone,email,enabled,marks,userinfo["create_time"],tm,adminRole)
                    res = str(user.User.modify_user(T))
                    response["status"] = res
                    response["msg"] = "修改成功!"
                else:
                    response["status"] = "0"
                    response["msg"] = "账号不能修改!"
        return json.dumps(response)
    def adminremove(self):
        ac = self.get_escaped_argument("adminName", "")
        return str(user.User.remove_user(ac))
    def exit(self):
        self.set_cookie("current_user", "")
        self.redirect("/")
    def enablededit(self):
        response = {}
        ac = self.get_escaped_argument("adminName", "")
        en = self.get_escaped_argument("enabled", "")
        res = str(user.User.enabled_user(en,ac))
        response["status"] = res
        response["msg"] = "修改成功!"
        return json.dumps(response)
    def adminbatchremove(self):
        response = {}
        batch = self.get_escaped_argument("batch", "")
        acs = batch.split(",")
        remove_number= 0;
        for ac in acs:
            if ac != "":
                remove_number += user.User.remove_user(ac)
        response["status"] = str(remove_number)
        response["msg"] = "删除成功!"
        return json.dumps(response)
    def getuser(self):
        cu = user.User.get_user_by_uid("lyy123")
        return json.dumps(cu)
    def myinfo(self):
        response = {}
        ac = self.get_escaped_argument("adminName", "")
        userinfo = user.User.getuser_by_acount(ac)
        pwd = self.get_escaped_argument("pwd", "")
        username = self.get_escaped_argument("userName", "")
        sex = self.get_escaped_argument("sex", "")
        email = self.get_escaped_argument("email", "")
        phone = self.get_escaped_argument("phone", "")
        adminRole = self.get_escaped_argument("adminRole", "")
        marks = self.get_escaped_argument("marks", "")
        tm = int(time.time())
        enabled = 1
        if userinfo["login_name"]==ac:
            T = ("",ac,pwd,username,sex,phone,email,enabled,marks,userinfo["create_time"],tm,adminRole)
            res = str(user.User.modify_user(T))
            response["status"] = res
            response["msg"] = "修改成功!"
        else:
            response["status"] = "0"
            response["msg"] = "账号不能修改!"
        return json.dumps(response)