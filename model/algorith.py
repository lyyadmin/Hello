'''
Created on 2017年12月7日

@author: admin
'''
from model import models

class Algorith(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def algorith_list(self):
        return self.list_data()
    def get_algorith_by_id(self,aid):
        if aid=="":
            db = {} 
            db["msg"] = "no" 
            cols = self.param
            for col in cols:
                db[col] = ""
            return db
        else:
            wh="where cat_id='"+aid+"'"
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
Algorith = Algorith()
# print(Algorith.algorith_list())