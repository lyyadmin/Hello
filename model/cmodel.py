'''
Created on 2017年12月7日

@author: admin
'''
from model import models,database,algorith, role
import json
class Model(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def add_model(self,T):
        V = ""
        for i in T:
            V+=",%s"
        V = V[1:len(V)]
        return self.insert_data(V,T)
    def add_model_kv(self,T):
        K = "(Id,model_id,model_name,db_id,cat_id,model_tablename,model_keys,model_keys_alias,user_id,show_type)"
        V = ""
        for it in T:
          V = V+",'"+str(it)+"'"
        V = "("+V[1:]+")"
        return self.insert_data_KV(K, V)
    def edit_model(self,T,modelid):
        V = self.param[:]
        V.remove("Id")
        V.remove("model_id")
        V.remove("user_id")
        length = len(V)
        w = "";
        for i in range(0,length):
            w = w+","+V[i]+"='"+str(T[i])+"'"
        w = w[1:len(w)]
        wh = "model_id='"+modelid+"'"
        return self.update_data(w,wh)
    def get_model_by_key(self,mid):
        if mid=="":
            model = {} 
            model["msg"] = "no" 
            cols = self.param
            for col in cols:
                model[col] = ""
            return model
        else:
            wh="where model_id='"+mid+"'"
            res = self.query_data(where=wh)
            models = []  
            if len(res)<=0:
                model = {} 
                model["msg"] = "no" 
                cols = self.param
                for col in cols:
                    model[col] = ""
                return model
            else:
                cols = self.param
                for r in res:
                    model = {}   
                    n = 0;
                    for col in cols:
                        model[col] = r[n]
                        n+=1
                    model["msg"] = "yes" 
                    dbid = model['db_id']
                    alid = model['cat_id']
                    db = database.Database.getdbbyid(dbid)
                    al = algorith.Algorith.get_algorith_by_id(alid)
                    model['db'] = db
                    model['algorith'] = al
                    models.append(model) 
            return models[0]
    def remove_model(self,mid):
        wh = "model_id='"+mid+"'"
        return self.delete_data(wh)
    def model_sort(self):
        return self.list()
    def model_list(self,modelName="",isjson=False,ro={"role_val":"","isadmin":0,"role_id":""}):
        mdls = self.list_data()
        modellist = []
        rolevalues = ro['role_val'].split(",")
        for m in mdls:
            dbid = m['db_id']
            alid = m['cat_id']
            db = database.Database.getdbbyid(dbid)
            al = algorith.Algorith.get_algorith_by_id(alid)
            m['db_name'] = db['db_name']
            m['algorith_name'] = al['cat_name']
            if rolevalues[0]=="model_list":
                if modelName=="":
                    modellist.append(m)
                else:
                    if modelName in m['model_name']:
                        modellist.append(m)
            elif ro['isadmin']==1:
                if modelName=="":
                    rls = []
                    rvs = ["add","modify","delete","query"]
                    for rv in rvs:
                        if rv=="add":
                            rls.append(rv)
                        else:
                            rls.append(m['model_id']+rv)
                    m['model_per'] = str(rls)
                    modellist.append(m)
                else:
                    if modelName in m['model_name']:
                        rls = []
                        rvs = ["add","modify","delete","query"]
                        for rv in rvs:
                            if rv=="add":
                                rls.append(rv)
                            else:
                                rls.append(m['model_id']+rv)
                        m['model_per'] = str(rls)
                        modellist.append(m)
            else:
                rls = []
                for rv in rolevalues:
                    if m['model_id'] in rv:
                        rls.append(rv)
                m['model_per'] = str(rls)
                if modelName=="": 
                    if "query" in m['model_per']:
                        modellist.append(m)
                    elif m['user_id']==ro['user_id']:
                        rls = []
                        rvs = ["add","modify","delete","query"]
                        for rv in rvs:
                            if rv=="add":
                                rls.append(rv)
                            else:
                                rls.append(m['model_id']+rv)
                        m['model_per'] = str(rls)
                        modellist.append(m)
                else:
                    if modelName in m['model_name']:
                        if "query" in m['model_per']:
                            modellist.append(m)
                        elif m['user_id']==ro['user_id']:
                            rls = []
                            rvs = ["add","modify","delete","query"]
                            for rv in rvs:
                                if rv=="add":
                                    rls.append(rv)
                                else:
                                    rls.append(m['model_id']+rv)
                            m['model_per'] = str(rls)
                            modellist.append(m)
        data = {}
        data['count'] = len(modellist)
        data['data'] = modellist 
        if "add" in rolevalues:
            data['add'] = "can"
        else:
            data['add'] = "cannot"
        if isjson:
            return json.dumps(data)
        else:
            return modellist
    def get_datas(self,m,k,l=""):
        db = m['db']
        table = m['model_tablename']
        return self.getdata_by_model(db,table,k,l)
Model = Model()
# print(Model.param)