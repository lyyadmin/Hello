'''
Created on 2017年12月7日

@author: admin
'''
import config
import pymysql
import json,time
import tornado
class Model():
    '''
    classdocs
    '''
    debug = True
    def __init__(self,cn="Model"):
        '''
        Constructor
        '''
        self.table_name = cn.lower()
        print("BEGIN init "+cn+" models !")
        self.cdb = config.configs['database']
        self.init_parameter()
    def init_parameter(self):
        self.param = self.gettable_column();
    def getdb(self):
        return config.configs['database']
    def getdatabase(self):
        db_ = self.cdb
        return db_['database']
    def getdbconnect(self):
        db_ = self.cdb
        return pymysql.connect(host=db_['hostname'],port=db_['port'],user=db_['username'],passwd=db_['password'],db=db_['database'],charset=db_['charset'])
    def getmyconnect(self,mydb):
        return pymysql.connect(host=mydb['db_host'],port=int(mydb['db_port']),user=mydb['db_acount'],passwd=mydb['db_password'],db=mydb['db_name'],charset='utf8')
    def xhtml_unescape(self,str):
        return tornado.escape.xhtml_unescape(str)
    def gettable_column(self):
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            db_ = self.cdb
            sql = "select  column_name from information_schema.columns where table_schema ='"+db_['database']+"'  and table_name = '"+self.table_name+"';"
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo[0])
        finally:
            cursor.close() 
            conn.close()  
        return lists
    def getdb_table_column(self,mydb,tn):
        conn = self.getmyconnect(mydb)
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select  column_name from information_schema.columns where table_schema ='"+mydb['db_name']+"'  and table_name = '"+tn+"';"
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo[0])
        finally:
            cursor.close() 
            conn.close()  
        return lists
    def query_sql(self,sql):
        if sql == "":
            return "no sql use !"
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close() 
            conn.close()  
        return lists
    def query_data(self,table="",select="*",where="",limit="",print_sql=False,isJson=False):
        if table == "":
            table = self.table_name
        if limit == "":
            limit = "order by "+str(self.param[0])+" asc"
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select "+select+" from "+table+" "+where+" "+limit+";"
            if print_sql:
                print(sql) 
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close() 
            conn.close()  
        if isJson:
            users = []  
            data = {}
            if len(lists)<=0:
                pass
            else:
                cols = self.param
                for r in lists:
                    user = {}   
                    n = 0;
                    for col in cols:
                        user[col] = r[n]
                        n+=1
                    users.append(user)
            data['count'] = len(users)
            data['users'] = users 
            return json.dumps(data)
        return lists
    def query_data_list(self,table="",select="*",where="",limit="",print_sql=False,isJson=False):
        if table == "":
            table = self.table_name
        if limit == "":
            limit = "order by "+str(self.param[0])+" asc"
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select "+select+" from "+table+" "+where+" "+limit+";"
            if print_sql:
                print(sql) 
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close() 
            conn.close()  
        users = []  
        data = {}
        if len(lists)<=0:
            pass
        else:
            cols = self.param
            for r in lists:
                user = {}   
                n = 0;
                for col in cols:
                    user[col] = r[n]
                    n+=1
                users.append(user)
        if isJson:
            data['count'] = len(users)
            data['users'] = users 
            return json.dumps(data)
        return users
    def list(self,where="",isjson=False):
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select * from "+self.table_name+" "+where+";"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close() 
            conn.close()  
        if isjson:
            users = []  
            data = {}
            if len(lists)<=0:
                pass
            else:
                cols = self.param
                for r in lists:
                    user = {}   
                    n = 0;
                    for col in cols:
                        if "_time" in col:
                            user[col] = self.timestamp_to_formattime(int(r[n]))
                        else:
                            user[col] = r[n]
                        n+=1
                    users.append(user)
            data['count'] = len(users)
            data['data'] = users 
            return json.dumps(data)
        return lists
    def list_data(self,where="",isjson=False):
        conn = self.getdbconnect()
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select * from "+self.table_name+" "+where+";"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close() 
            conn.close()  
        users = []  
        if len(lists)<=0:
            pass
        else:
            cols = self.param
            for r in lists:
                user = {}   
                n = 0;
                for col in cols:
                    if "_time" in col:
                        user[col] = self.timestamp_to_formattime(int(r[n]))
                    else:
                        user[col] = r[n]
                    n+=1
                users.append(user)
        if isjson:
            data = {}
            data['count'] = len(users)
            data['data'] = users 
            return json.dumps(data)
        else:
            return users
    def keys_list_data(self,mydb,tn,keys="*",where="",isjson=False):
        conn = self.getmyconnect(mydb);
        cursor = conn.cursor()
        lists = []
        try:
            sql = "select "+keys+" from "+tn+" "+where+";"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                cols = cursor.fetchall()
                cols = list(cols)
                for clo in cols:
                    lists.append(clo)
        finally:
            cursor.close()
            conn.close()
        users = []
        if len(lists)<=0:
            pass
        else:
            cols = self.param
            if keys!="*":
                cols = keys.split(",");
            for r in lists:
                user = {}
                n = 0;
                for col in cols:
                    if "_time" in col:
                        user[col] = self.timestamp_to_formattime(int(r[n]))
                    else:
                        user[col] = r[n]
                    n+=1
                users.append(user)
        if isjson:
            data = {}
            data['count'] = len(users)
            data['data'] = users
            return json.dumps(data)
        else:
            return users
    def insert_data(self,V,T):
        conn = self.getdbconnect()
        cursor = conn.cursor()  
        res = 0
        try:
            res = cursor.execute("insert into "+self.table_name+" values ("+V+")", T)
        finally:
            cursor.close()  
            conn.commit()  
            conn.close() 
        return res
    def insert_data_KV(self,K,V):
        conn = self.getdbconnect()
        cursor = conn.cursor()  
        res = 0
        try:
            sql = "INSERT INTO "+self.table_name+K+" VALUE"+V;
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
        finally:
            cursor.close()  
            conn.commit()  
            conn.close() 
        return res
    def update_data(self,w,wh):
        conn = self.getdbconnect()
        cursor = conn.cursor()  
        res = 0
        try:
            sql = "UPDATE "+self.table_name+" SET "+w+" WHERE "+wh+";"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
        finally:
            cursor.close()  
            conn.commit()  
            conn.close() 
        return res
    def delete_data(self,wh):
        conn = self.getdbconnect()
        cursor = conn.cursor()  
        res = 0
        try:
            sql = "delete from "+self.table_name+" where "+wh
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
        finally:
            cursor.close()  
            conn.commit()  
            conn.close() 
        return res
    def execute_sql(self,sql):
        conn = self.getdbconnect()
        cursor = conn.cursor()  
        res = 0
        try:
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
        finally:
            cursor.close()  
            conn.commit()  
            conn.close() 
        return res
    def get_user(self,uid):
        conn = self.getdbconnect()
        cursor = conn.cursor()
        user = {}
        try:
            sql = "select * from "+self.table_name+" where user_id='"+uid+"';"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                user = cursor.fetchone()
        finally:
            cursor.close() 
            conn.close()
        return user
    def timestamp_to_formattime(self,timestamp):
        timeArray = time.localtime(timestamp)
        return time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
    def get_tables(self,mydb,isjson=False):
        conn = self.getmyconnect(mydb)
        cursor = conn.cursor()
        tables = []
        try:
            sql = "SHOW TABLES;"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                res = cursor.fetchall()
                for r in res:
                    table = {}
                    table['name'] = r[0]
                    table['key'] = self.getdb_table_column(mydb,r[0])
                    tables.append(table)
        finally:
            cursor.close() 
            conn.close()
        if isjson:
            return json.dumps(tables)
        return tables
    def getdata_by_model(self,db,table,keys,limit=""):
        conn = self.getmyconnect(db)
        cursor = conn.cursor()
        params = keys.split(",")
        datas = []
        try:
            sql = "select "+keys+" from "+table+limit+";"
            if self.debug:
                print(sql)
            res = cursor.execute(sql)
            if res != 0:
                data = cursor.fetchall()
                for d in data:
                    da = {}   
                    n = 0;
                    for col in params:
                        if "_time" in col or "_date" in col:
                            da[col] = self.timestamp_to_formattime(int(d[n]))
                        else:
                            da[col] = d[n]
                        n+=1
                    datas.append(da)
        finally:
            cursor.close() 
            conn.close()
        return datas
        