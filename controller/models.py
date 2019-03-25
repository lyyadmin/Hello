'''
Created on 2017年12月5日

@author: admin
'''
import json
from controller import base
from model import role
from model import cmodel,user
import uuid,tornado

class ModelController(base.Controller):
    def modelact(self):
        response = {}
        action = self.get_escaped_argument("action")
        ac = self.get_cookie("current_user", "")
        usr = user.User.getuser_by_acount(ac)
        uid = usr['user_id']
        print(action)
        mo = self.get_escaped_argument("modelName", "")
        data = self.get_escaped_argument("dataName", "")
        al = self.get_escaped_argument("algorithName", "")
        tb = self.get_escaped_argument("tableName", "")
        key_params = self.get_escaped_argument("modelKeys", "")
        keyalias = self.get_escaped_argument("keyalias", "")
        ct = self.get_escaped_argument("chartType", "")
        if action == "addmodel":
            mid = str(uuid.uuid1())
            T = ("",mid,mo,data,al,tb,key_params,keyalias,uid,ct)
            res = str(cmodel.Model.add_model_kv(T))
            response["status"] = res
            response["msg"] = "添加成功!"
            vals = "add,"+mid+"modify,"+mid+"delete,"+mid+"query"
            user.User.modify_admin_per_val(vals)
        elif action == "editmodel":
            T = (mo,data,al,tb,key_params,keyalias,ct)
            modelid = self.get_escaped_argument("mid", "")
            res = str(cmodel.Model.edit_model(T,modelid))
            response["status"] = res
            response["msg"] = "修改成功!"
        else:
            pass
        return json.dumps(response)
    def modellist(self):
        mn = self.get_escaped_argument("modelName", "")
        uer = self.get_cookie("current_user", "")
        r = role.Role.get_role(usr=uer)
        lst = cmodel.Model.model_list(modelName=mn, isjson=True,ro=r)
        return lst
    def modelremove(self):
        modelid = self.get_escaped_argument("mid", "")
        return str(cmodel.Model.remove_model(modelid))
    def modelbatchremove(self):
        response = {}
        batch = self.get_escaped_argument("batch", "")
        mids = batch.split(",")
        remove_number= 0;
        for id in mids:
            remove_number += cmodel.Model.remove_model(id)
        response["status"] = str(remove_number)
        response["msg"] = "删除成功!"
        return json.dumps(response)
    def modeldata(self):
        mid = self.get_escaped_argument("id", "")
        m = cmodel.Model.get_model_by_key(mid)
        dics = eval(tornado.escape.xhtml_unescape(m['model_keys_alias']))
        keys = m['model_keys']
        print(keys)
        if keys=="":
            keys="*"
        leylist = keys.split(",")
        dics = self.order_by_keys(leylist, dics);
        print(dics)
        limit = " LIMIT 50" #数据条数
        datas = cmodel.Model.get_datas(m,keys,limit)
        response = {}
        response["count"] = len(datas)
        response["data"] = datas
        response["key_alias"] = dics
        response["name"] = m['model_name']+"数据"
        return json.dumps(response)
        