'''
Created on 2017年12月5日

@author: admin
'''
import json,uuid
from controller import base
from model import database

class DatabaseController(base.Controller):
    def dbact(self):
        response = {}
        action = self.get_escaped_argument("action")
        print(action)
        host = self.get_escaped_argument("dbHost", "")
        name = self.get_escaped_argument("dbName", "")
        port = self.get_escaped_argument("dbPort", "")
        ac = self.get_escaped_argument("dbAcount", "")
        pwd = self.get_escaped_argument("dbPwd", "")
        type = self.get_escaped_argument("dbType", "")
        if action == "adddb":
            dbid = str(uuid.uuid1())
            T = ("",dbid,host,name,port,ac,pwd,type,0)
            res = str(database.Database.add_dbt(T))
            response["status"] = res
            response["msg"] = "添加成功!"
        elif action == "editdb":
            T = (host,name,port,ac,pwd,type)
            dbid = self.get_escaped_argument("dbid", "")
            res = str(database.Database.edit_db(T,dbid))
            response["status"] = res
            response["msg"] = "修改成功!"
        else:
            pass
        return json.dumps(response)
    def dblist(self):
        return database.Database.db_list()
    def dbremove(self):
        dbid = self.get_escaped_argument("dbid", "")
        return str(database.Database.remove_db(dbid))
    def perbatchremove(self):
        response = {}
        batch = self.get_escaped_argument("batch", "")
        ids = batch.split(",")
        remove_number= 0;
        for id in ids:
            remove_number += database.Database.remove_db(id)
        response["status"] = str(remove_number)
        response["msg"] = "删除成功!"
        return json.dumps(response)
    def dataconn(self):
        dbid = self.get_escaped_argument("dbid", "")
        db = database.Database.getdbbyid(dbid)
        try:
            conn = database.Database.getmyconnect(db)
            res = database.Database.modify_conn(dbid)
            return str(res)
        finally:
            conn.close()  
        return "0"
    def tablelist(self):
        dbname = self.get_escaped_argument("dbname", "")
        dbid = self.get_escaped_argument("dbid", "")
        cdb = database.Database.getcurrent_database()
        if dbname != "":
            cdb = database.Database.getdbbyname(dbname)
        if dbid != "":
            cdb = database.Database.getdbbyid(dbid)
        response = {}
        tables = []
        if cdb["msg"] == "no":
            response["count"] = "0"
            response["msg"] = "获取失败!"
        else:
            tables = database.Database.get_tables_in_db(cdb)
            response["count"] = len(tables)
            response["msg"] = "获取成功!"
        response["data"] = tables
        return json.dumps(response)
        