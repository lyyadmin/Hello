'''
Created on 2017年12月5日

@author: admin
'''
import json
from controller import base
from model import permission

class PermissionController(base.Controller):
    def peract(self):
        response = {}
        action = self.get_escaped_argument("action")
        print(action)
        name = self.get_escaped_argument("perName", "")
        key = self.get_escaped_argument("perValue", "")
        if action == "addper":
            T = ("",name,key)
            res = str(permission.Permission.add_per_kv(T))
            response["status"] = res
            response["msg"] = "添加成功!"
        elif action == "editper":
            T = (name,key)
            perid = self.get_escaped_argument("perid", "")
            res = str(permission.Permission.edit_per(T,perid))
            response["status"] = res
            response["msg"] = "修改成功!"
        else:
            pass
        return json.dumps(response)
    def perlist(self):
        perName = self.get_escaped_argument("perName", "")
        wh = ""
        if perName != "":
            wh+="where per_name='"+perName+"'"
        return permission.Permission.list(where=wh,isjson=True)
    def perremove(self):
        perid = self.get_escaped_argument("perid", "")
        return str(permission.Permission.remove_per(perid))
    def perbatchremove(self):
        response = {}
        batch = self.get_escaped_argument("batch", "")
        ids = batch.split(",")
        remove_number= 0;
        for id in ids:
            remove_number += permission.Permission.remove_per(id)
        response["status"] = str(remove_number)
        response["msg"] = "删除成功!"
        return json.dumps(response)
        