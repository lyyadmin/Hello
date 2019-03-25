'''
Created on 2017年12月7日

@author: admin
'''
from model import models,user
class Role(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def getRolebyid(self,roleid):
        if roleid=="":
            role = {} 
            role["msg"] = "no" 
            cols = self.param
            for col in cols:
                role[col] = ""
            return role
        else:
            wh="where role_id='"+roleid+"'"
            res = self.query_data(where=wh)
            roles = []  
            if len(res)<=0:
                role = {} 
                role["msg"] = "no" 
                cols = self.param
                for col in cols:
                    role[col] = ""
                return role
            else:
                cols = self.param
                for r in res:
                    role = {}   
                    n = 0;
                    for col in cols:
                        role[col] = r[n]
                        n+=1
                    role["msg"] = "yes" 
                    roles.append(role) 
            return roles[0]
    def remove_role(self,roleid):
        wh = "role_id='"+roleid+"'"
        return self.delete_data(wh)
    def add_role(self,T):
        V = ""
        for i in T:
            V+=",%s"
        V = V[1:len(V)]
        return self.insert_data(V,T)
    def add_role_kv(self,T):
        K = "(Id,role_name,role_id,role_val,role_mark)"
        V = ""
        for it in T:
          V = V+",'"+str(it)+"'"
        V = "("+V[1:]+")"
        return self.insert_data_KV(K,V)
    def edit_role(self,T,roleid):
        V = self.param[:]
        V.remove("Id")
        V.remove("role_id")
        length = len(V)
        w = "";
        for i in range(0,length):
            w = w+","+V[i]+"='"+str(T[i])+"'"
        w = w[1:len(w)]
        wh = "role_id='"+roleid+"'"
        return self.update_data(w,wh)
    def get_role(self,usr=""):
        ur = user.User.getuser_by_acount(usr)
        ro = self.getRolebyid(ur['role_id'])
        ro['isadmin'] = ur['isadmin']
        ro['user_id'] = ur['user_id']
        return ro
    def change_per_vals(self,ro,pers):
        p = ro['role_val']+","+pers
        T = (pers)
        w = "role_val";
        wh = "role_id='"+ro['role_id']+"'"
        return self.update_data(w,wh)
Role = Role()
# print(Role.param)