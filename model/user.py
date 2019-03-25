'''
Created on 2017年12月7日

@author: admin
'''
from model import models,cache,role
import json

class User(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def getdata(self):
        self.table_name
    def exist(self,acount,password):
        wh="where login_name='"+acount+"' and password='"+password+"'"
        return self.query_data_list(where=wh)
    def getuser(self,acount ,password):
        wh="where login_name='"+acount+"' and password='"+password+"'"
        res = self.query_data(where=wh)
        users = []  
        if len(res)<=0:
            pass
        else:
            cols = self.param
            for r in res:
                user = {}   
                n = 0;
                for col in cols:
                    user[col] = r[n]
                    n+=1
                users.append(user) 
        return json.dumps(users[0])
    def insert_user(self,T):
        V = ""
        for i in T:
            V+=",%s"
        V = V[1:len(V)]
        return self.insert_data(V,T)
    def insert_user_kv(self,T):
        K = "(Id,login_name,password,user_id,user_name,sex,phone,email,enabled,marks,create_time,update_time,role_id,login_time,login_host)"
        V = ""
        for it in T:
          V = V+",'"+str(it)+"'"
        V = "("+V[1:]+")"
        return self.insert_data_KV(K,V)
    def modify_user(self,T):
        V = self.param[:]
        V.remove("user_id")
        V.remove("login_host")
        V.remove("login_time")
        V.remove("login_count")
        V.remove("isadmin")
        w = "";
        for i in range(1,len(V)):
            w = w+","+V[i]+"='"+str(T[i])+"'"
        w = w[1:len(w)]
        wh = "login_name='"+T[1]+"'"
        return self.update_data(w,wh)
    def remove_user(self,ac):
        wh = "user_id='"+ac+"'"
        return self.delete_data(wh)
    def enabled_user(self,e,a):
        s = "UPDATE "+self.table_name+" SET enabled="+str(e)+" WHERE user_id='"+a+"';"
        return self.execute_sql(s)
    def getuser_by_acount(self,acount):
        if acount=="":
            user = {} 
            user["msg"] = "no" 
            cols = self.param
            for col in cols:
                user[col] = ""
            return user
        else:
            wh="where login_name='"+acount+"'"
            res = self.query_data(where=wh)
            users = []  
            if len(res)<=0:
                user = {} 
                user["msg"] = "no" 
                cols = self.param
                for col in cols:
                    user[col] = ""
                return user
            else:
                cols = self.param
                for r in res:
                    user = {}   
                    n = 0;
                    for col in cols:
                        if "_time" in col:
                            user[col] = self.timestamp_to_formattime(int(r[n]))
                        else:
                            user[col] = r[n]
                        n+=1
                    user["msg"] = "yes" 
                    users.append(user) 
            return users[0]
    def getvoiduser(self,uid):
        if uid=="":
            user = {} 
            user["msg"] = "no" 
            cols = self.param
            for col in cols:
                user[col] = ""
            return user
        else:
            wh="where user_id='"+uid+"'"
            res = self.query_data(where=wh)
            users = []  
            if len(res)<=0:
                user = {} 
                user["msg"] = "no" 
                cols = self.param
                for col in cols:
                    user[col] = ""
                return user
            else:
                cols = self.param
                for r in res:
                    user = {}   
                    n = 0;
                    for col in cols:
                        user[col] = r[n]
                        n+=1
                    user["msg"] = "yes" 
                    users.append(user) 
            return users[0]
    def get_user_by_uid(self,uid):
        res = self.get_user(uid)
        user = {}
        cols = self.param
        n = 0;
        for col in cols:
            user[col] = res[n]
            if "_time" in col:
                user[col] = self.timestamp_to_formattime(int(res[n]))
            n+=1
        return user
    def getUsersByRoleId(self,roleid):
        wh = "where role_id='"+roleid+"'"
        users = self.list_data(wh)
        uu = ""
        if len(users)>0:
            for us in users:
                uu=uu+","+us['user_name']
            uu = uu[1:]
        return uu
    def update_login_status(self,user,tm,host):
        count = int(user['login_count'])+1
        w = "login_time='"+str(tm)+"',login_count="+str(count)+",login_host='"+host+"'"
        wh = "login_name='"+user['login_name']+"'"
        return self.update_data(w,wh)
    def get_admin_info(self):
        wh = "where isadmin=1"
        users = self.list_data(where=wh)
        return users[0]
    def modify_admin_per_val(self,vals):
        admin = self.get_admin_info()
        ro = role.Role.getRolebyid(admin['role_id'])
        val = ro['role_val']
        val = val+","+vals
        T = [val]
        w = "role_val='"+val+"'"
        wh = "role_id='"+ro['role_id']+"'"
        role.Role.update_data(w, wh)
User = User()
# print(User.param)