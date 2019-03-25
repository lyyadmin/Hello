'''
Created on 2017年12月5日

@author: admin
'''
from controller import base
from model import role,user
import uuid,json
class RoleController(base.Controller):
    def rolelist(self):
        roles = role.Role.list_data()
        for ro in roles:
            ro['role_users'] = user.User.getUsersByRoleId(ro['role_id'])
        data = {}
        data['count'] = len(roles)
        data['data'] = roles 
        return json.dumps(data)
    def roleremove(self):
        roleid = self.get_escaped_argument("roleid", "")
        return str(role.Role.remove_role(roleid))
    def roleedit(self):
        act = self.get_escaped_argument("action", "")
        name = self.get_escaped_argument("roleName", "")
        mark = self.get_escaped_argument("roleMark", "")
        roleval = self.get_escaped_argument("roleval", "")
        print(roleval)
        response = {}
        if act == "addrole":
            roleid = str(uuid.uuid1())
            T = ("",name,roleid,roleval,mark)
            res = str(role.Role.add_role_kv(T))
            response["status"] = res
            response["msg"] = "添加成功!"
        elif act == "editrole":
            T = (name,roleval,mark)
            roleid = self.get_escaped_argument("roleid", "")
            res = str(role.Role.edit_role(T,roleid))
            response["status"] = res
            response["msg"] = "修改成功!"
        else:
            pass
        return json.dumps(response)
    def rolebatchremove(self):
        response = {}
        batch = self.get_escaped_argument("batch", "")
        ids = batch.split(",")
        remove_number= 0;
        for id in ids:
            remove_number += role.Role.remove_role(id)
        response["status"] = str(remove_number)
        response["msg"] = "删除成功!"
        return json.dumps(response)
