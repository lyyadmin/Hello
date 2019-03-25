'''
Created on 2017年12月5日

@author: admin
'''
from model import websocket

class WebsocketController(websocket.WebSocketHandler):
    clients = set()

    def method(self,act):
        fun = self.__getattribute__(act)
        return fun()

    @staticmethod
    def send_to_all(self,message):
        for c in self.clients:
            c.write_message(message)

    @staticmethod
    def all_to_self(self):
        for c in self.clients:
            self.write_message("user"+str(id(c)))

    def open(self,act):
        self.method(act)

    def on_message(self,msg):
        if len(msg)<=0:
            return;
        self.send_to_all(self, "sendmsg" + str(id(self))+":"+msg)
    def on_close(self):
        print("on_close")
        self.clients.remove(self)
        self.send_to_all(self,str(id(self)) + ' 已经离开!')
        self.send_to_all(self,"closeuser"+str(id(self)))

    def startrun(self):
        self.demo()

    def connect(self):
        self.all_to_self(self)
        self.write_message("currentuser"+str(id(self)))
        self.send_to_all(self,"用户"+str(id(self))+"上线啦")
        self.clients.add(self)
        self.send_to_all(self,"user"+str(id(self)))

    def adminconnect(self):
        self.all_to_self(self)
        self.clients.add(self)
