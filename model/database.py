'''
Created on 2017年12月7日

@author: admin
'''
from model import models

class Odatabase(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def database_list(self):
        return self.list_data()
    def remove_db(self,dbid):
        wh = "db_id='"+dbid+"'"
        return self.delete_data(wh)
    def add_db(self,T):
        V = ""
        for i in T:
            V+=",%s"
        V = V[1:len(V)]
        return self.insert_data(V,T)
    def add_dbt(self,T):
        K = "(Id,db_id,db_host,db_name,db_port,db_acount,db_password,db_type,status)"
        V = ""
        for it in T:
          V = V+",'"+str(it)+"'"
        V = "("+V[1:]+")"
        return self.insert_data_KV(K, V)
    def edit_db(self,T,dbid):
        V = self.param[:]
        V.remove("Id")
        V.remove("db_id")
        V.remove("status")
        length = len(V)
        w = "";
        for i in range(0,length):
            w = w+","+V[i]+"='"+str(T[i])+"'"
        w = w[1:len(w)]
        wh = "db_id='"+dbid+"'"
        return self.update_data(w,wh)
    def db_list(self):
        return self.list_data(isjson=True)
    def modify_conn(self,dbid):
        sql = "UPDATE "+self.table_name+" SET status=0;"
        self.execute_sql(sql)
        sql = "UPDATE "+self.table_name+" SET status=1 WHERE db_id='"+dbid+"';"
        return self.execute_sql(sql)
    def getdbbyid(self,dbid):
        if dbid=="":
            db = {} 
            db["msg"] = "no" 
            cols = self.param
            for col in cols:
                db[col] = ""
            return db
        else:
            wh="where db_id='"+dbid+"'"
            res = self.query_data(where=wh)
            dbs = []  
            if len(res)<=0:
                db = {} 
                db["msg"] = "no" 
                cols = self.param
                for col in cols:
                    db[col] = ""
                return db
            else:
                cols = self.param
                for r in res:
                    db = {}   
                    n = 0;
                    for col in cols:
                        db[col] = r[n]
                        n+=1
                    db["msg"] = "yes" 
                    dbs.append(db) 
            return dbs[0]
    def getdbbyname(self,dbname):
        if dbname=="":
            db = {} 
            db["msg"] = "no" 
            cols = self.param
            for col in cols:
                db[col] = ""
            return db
        else:
            wh="where db_name='"+dbname+"'"
            res = self.query_data(where=wh)
            dbs = []  
            if len(res)<=0:
                db = {} 
                db["msg"] = "no" 
                cols = self.param
                for col in cols:
                    db[col] = ""
                return db
            else:
                cols = self.param
                for r in res:
                    db = {}   
                    n = 0;
                    for col in cols:
                        db[col] = r[n]
                        n+=1
                    db["msg"] = "yes" 
                    dbs.append(db) 
            return dbs[0]
    def getcurrent_database(self,dbid=""):
        wh="where status=1"
        if dbid!="":
            wh = wh+" and db_id='"+dbid+"'"
        res = self.query_data(where=wh)
        dbs = []  
        if len(res)<=0:
            db = {} 
            db["msg"] = "no" 
            cols = self.param
            for col in cols:
                db[col] = ""
            return db
        else:
            cols = self.param
            for r in res:
                db = {}   
                n = 0;
                for col in cols:
                    db[col] = r[n]
                    n+=1
                db["msg"] = "yes" 
                dbs.append(db) 
        return dbs[0]
    def get_tables_in_db(self,db):
        return self.get_tables(db)
    def data_list(self,mydb,tn,ks):
        return self.keys_list_data(mydb,tn,ks)
Database = Odatabase()
# print(Database.param)