'''
Created on 2017年12月5日

@author: admin
'''
from controller import base
from model import user, permission, role, operate, database, cache, menu, algorith,chart
from model import cmodel
import tornado
class HtmlController(base.Controller):
    def post(self, act):
#         base.Controller.post(self, act)
        pass
    def get(self,v):
        cuser = self.get_cookie("current_user", "")
        if cuser=="":
            self.render("admin/login.html")
        else:
            a = self.get_escaped_argument("act", "index")
            self.callback(a,v)
    def index(self,a,v):
        cuser = self.get_cookie("current_user", "")
        userinfo = user.User.getuser_by_acount(cuser)
        userinfo['role_val'] = role.Role.getRolebyid(userinfo['role_id'])['role_val']
        if v == "main.html":
            menus = menu.Menu.get_menu(userinfo)
            self.render("admin/"+v,user=userinfo,do=a,mns = menus)
        elif v == "":
            menus = menu.Menu.get_menu(userinfo)
            self.render("admin/main.html",user=userinfo,do=a,mns = menus)
        else:
            llh = cache.Cache.get(cuser+"last_login_host",str(userinfo['login_host']))
            llt = cache.Cache.get(cuser+"last_login_time",str(userinfo['login_time'])) 
            self.render("admin/"+v,user=userinfo,do=a,lh = llh,lt = llt)
    def editadmin(self,a,v):
        u = self.get_escaped_argument("ac", "")
        userinfo = user.User.getvoiduser(u)
        rolelist = role.Role.list_data();
        self.render("admin/"+v,user=userinfo,do=a,roles=rolelist)
    def addadmin(self,a,v):
        userinfo = user.User.getvoiduser("")
        rolelist = role.Role.list_data();
        self.render("admin/"+v,user=userinfo,do=a,roles=rolelist)
    def addper(self,a,v):
        perinfo = permission.Permission.getPermissionbykey("");
        self.render("admin/"+v,per=perinfo,do=a)
    def editper(self,a,v):
        perkey = self.get_escaped_argument("perkey", "")
        perinfo = permission.Permission.getPermissionbykey(perkey);
        self.render("admin/"+v,per=perinfo,do=a)
    def editrole(self,a,v):
        roleid = self.get_escaped_argument("roleid", "")
        roleinfo = role.Role.getRolebyid(roleid);
        model_list = cmodel.Model.model_list(ro={"role_val":"model_list,model_list"})
        per_list = permission.Permission.list_data()
        role_per_list = roleinfo["role_val"].split(",")
        print(per_list)
        self.render("admin/"+v,role=roleinfo,do=a,ops=model_list,pers=per_list,rp=role_per_list)
    def addrole(self,a,v):
        roleinfo = role.Role.getRolebyid("");
        model_list = cmodel.Model.model_list(ro={"role_val":"model_list,model_list"})
        per_list = permission.Permission.list_data()
        role_per_list = roleinfo["role_val"].split(",")
        print(per_list)
        self.render("admin/"+v,role=roleinfo,do=a,ops=model_list,pers=per_list,rp=role_per_list)
    def editdb(self,a,v):
        dbid = self.get_escaped_argument("dbid", "")
        print(dbid)
        dbinfo = database.Database.getdbbyid(dbid);
        self.render("admin/"+v,db=dbinfo,do=a)
    def adddb(self,a,v):
        dbinfo = database.Database.getdbbyid("");
        self.render("admin/"+v,db=dbinfo,do=a)
    def tablelist(self,a,v):
        cdb = database.Database.getcurrent_database()
        tables = database.Database.get_tables_in_db(cdb)
        self.render("admin/"+v,tbs=tables,count=len(tables))
    def myinfo(self,a,v):
        cuser = self.get_cookie("current_user", "")
        userinfo = user.User.getuser_by_acount(cuser)
        rolelist = role.Role.list_data();
        self.render("admin/"+v,user=userinfo,do=a,roles=rolelist)
    def addmodel(self,a,v):
        m = cmodel.Model.get_model_by_key("")
        db = cache.Cache.get("dblist", [])
        if len(db)<=0:
            db = database.Database.database_list()
            cache.Cache.set("dblist", db)
        alg = cache.Cache.get("algorithlist", [])
        if len(alg)<=0:
            alg = algorith.Algorith.algorith_list()
            cache.Cache.set("algorithlist", alg)
        tb = database.Database.get_tables(db[0])
        dics = eval('{}')
        cat = chart.Chart.chart_list()
        self.render("admin/"+v,do=a,m=m,dts=db,als=alg,tbs=tb,alias=dics,c=cat)
    def editmodel(self,a,v):
        mid = self.get_escaped_argument("mid", "")
        m = cmodel.Model.get_model_by_key(mid)
        db = cache.Cache.get("dblist", [])
        if len(db)<=0:
            db = database.Database.database_list()
            cache.Cache.set("dblist", db)
        alg = cache.Cache.get("algorithlist", [])
        if len(alg)<=0:
            alg = algorith.Algorith.algorith_list()
            cache.Cache.set("algorithlist", alg)
        tb = cache.Cache.get(m['db_id'],[])
        if len(tb)<=0:
            tb = database.Database.get_tables(m['db'])
            cache.Cache.set(m['db_id'], tb)
        dics = eval(tornado.escape.xhtml_unescape(m['model_keys_alias']))
        keys = m['model_keys'].split(',')
        cat = chart.Chart.chart_list()
        self.render("admin/"+v,do=a,m=m,dts=db,als=alg,tbs=tb,alias=dics,keylist=keys,c=cat)
