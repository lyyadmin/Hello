'''
Created on 2017年12月5日

@author: admin
'''
import tornado,socket

class Controller(tornado.web.RequestHandler):
    def post(self,act):
        if act.find("_view")>-1:
            self.method(act)
        else:
            self.write(self.method(act))
    def get(self,act):
        self.method(act)
    def method(self,act):
        fun = self.__getattribute__(act)
        return fun()
    def callback(self,act,v='login.html'):
        fun = self.__getattribute__(act)
        return fun(act,v)
    def write_error(self, status_code, **kwargs):
        if status_code == 404:
            self.render('404.html')
        else:
            self.write('error:' + str(status_code))
    def escape_string(self, s):
        return tornado.escape.xhtml_escape(s)
    def get_escaped_argument(self, key, default = None):
        if default is not None:
            return self.escape_string(self.get_argument(key, default))
        else:
            return self.escape_string(self.get_argument(key))
    def gethostname(self):
        return socket.getfqdn(socket.gethostname())
    def getip(self):
        return socket.gethostbyname(self.gethostname())
    def order_by_keys(self,keys,dics):
        dic = {}
        for key in keys:
            if key in dics.keys():
                dic[key] = dics[key]
        return dic

    def get_host_ip(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
        finally:
            s.close()
        return ip