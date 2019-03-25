'''
Created on 2017年12月5日

@author: admin
'''
import time
import json
import base64

import uuid
from controller import base
from model import  database


class WorkflowController(base.Controller):
    def get(self,v='index.html'):
        index = v.find("view");
        if index>-1:
            jsonstr = v[index+4:];
            jsonstr = base64.b64decode(jsonstr).decode("utf-8");
            jsonarray = json.loads(jsonstr);
            driver = jsonarray["mtype"];
            table = jsonarray["mtable"];
            keys = jsonarray["mkeys"];
            mydb = {'db_host': jsonarray["mhost"], 'db_port': jsonarray["mport"], 'db_acount': jsonarray["muser"], 'db_password': jsonarray["mpwd"], 'db_name': jsonarray["mdb"]};
            if driver == "mysql":
                try:
                    dta = database.Database.data_list(mydb, table, keys);
                    jsonstr = dta;
                finally:
                    pass
            else:
                pass
            url = "workflow/" + v[0:index]+".html";
            self.render(url,data=jsonstr);
        else:
            # hst = "192.168.1.106"
            hst = self.get_host_ip();
            userid = self.get_argument("userid", "");
            zw = self.get_argument("zw", "");
            self.render("workflow/"+v,uid=userid,room=zw,host=hst);
    def connect_db(self):
        driver = self.get_argument("mtype", "");
        host = self.get_argument("mhost", "");
        port = self.get_argument("mport", "");
        db = self.get_argument("mdb", "");
        user = self.get_argument("muser", "");
        pwd = self.get_argument("mpwd", "");
        mydb = {'db_host':host,'db_port':port,'db_acount':user,'db_password':pwd,'db_name':db};
        if driver=="mysql":
            try:
                tables = database.Database.get_tables_in_db(mydb);
                return json.dumps(tables)
            finally:
                pass
        else:
            pass
        return "0"
    def get_datas_view(self):
        driver = self.get_argument("mtype", "");
        host = self.get_argument("mhost", "");
        port = self.get_argument("mport", "");
        db = self.get_argument("mdb", "");
        user = self.get_argument("muser", "");
        pwd = self.get_argument("mpwd", "");
        table = self.get_argument("mtable", "");
        keys = self.get_argument("mkeys", "");
        mydb = {'db_host':host,'db_port':port,'db_acount':user,'db_password':pwd,'db_name':db};
        dta = keys;
        if driver=="mysql":
            try:
                dta = database.Database.data_list(mydb,table,keys);
                print(dta)
            finally:
                pass
        else:
            pass
        self.redirect("workflow/data.html", data=dta);
    def startrun(self):
        driver = self.get_argument("mtype", "");
        host = self.get_argument("mhost", "");
        port = self.get_argument("mport", "");
        db = self.get_argument("mdb", "");
        user = self.get_argument("muser", "");
        pwd = self.get_argument("mpwd", "");
        table = self.get_argument("mtable", "");
        keys = self.get_argument("mkeys", "");
        method = self.get_argument("mfunction", "");
        mydb = {'db_host':host,'db_port':port,'db_acount':user,'db_password':pwd,'db_name':db};
        dta = keys;
        if driver=="mysql":
            try:
                dta = database.Database.data_list(mydb,table,keys);
                return "1";
            finally:
                pass
        else:
            pass
        return "0";

        