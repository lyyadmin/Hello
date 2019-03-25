'''
Created on 2017年12月7日

@author: admin
'''
from model import models
class Permission(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def add_per(self,T):
        V = ""
        for i in T:
            V+=",%s"
        V = V[1:len(V)]
        return self.insert_data(V,T)
    def add_per_kv(self,T):
        K = "(Id,per_name,per_key)"
        V = ""
        for it in T:
          V = V+",'"+str(it)+"'"
        V = "("+V[1:]+")"
        return self.insert_data_KV(K, V)
    def edit_per(self,T,perid):
        V = self.param[:]
        V.remove("Id")
        length = len(V)
        w = "";
        for i in range(0,length):
            w = w+","+V[i]+"='"+str(T[i])+"'"
        w = w[1:len(w)]
        wh = "ID="+perid
        return self.update_data(w,wh)
    def getPermissionbykey(self,key):
        if key=="":
            per = {} 
            per["msg"] = "no" 
            cols = self.param
            for col in cols:
                per[col] = ""
            return per
        else:
            wh="where per_key='"+key+"'"
            res = self.query_data(where=wh)
            pers = []  
            if len(res)<=0:
                per = {} 
                per["msg"] = "no" 
                cols = self.param
                for col in cols:
                    per[col] = ""
                return per
            else:
                cols = self.param
                for r in res:
                    per = {}   
                    n = 0;
                    for col in cols:
                        per[col] = r[n]
                        n+=1
                    per["msg"] = "yes" 
                    pers.append(per) 
            return pers[0]
    def remove_per(self,pid):
        wh = "per_key='"+pid+"'"
        return self.delete_data(wh)
    def model_sort(self):
        return self.list()
Permission = Permission()
# print(Permission.param)