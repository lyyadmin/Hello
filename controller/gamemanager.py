'''
Created on 2017年12月5日

@author: admin
'''
from model import websocket

class GameManagerController(websocket.WebSocketHandler):
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
            self.write_message(c.info)

    @staticmethod
    def get_same_room_info(self):
        for c in self.clients:
            if c.room == self.room:
                self.write_message(c.info)

    @staticmethod
    def send_to_same_room(self):
        for c in self.clients:
            if c.room == self.room and c.current_user != self.current_user:
                c.write_message(self.info)
                self.write_message(c.info+":"+c.ready)
                break

    @staticmethod
    def send_same_room_info(self,msg):
        for c in self.clients:
            if c.room == self.room and c.current_user != self.current_user:
                c.write_message(msg)
                self.write_message(msg)

    def open(self,act):
        self.clients.add(self)
        self.method(act)

    def on_message(self,msg):
        print(msg)
        if len(msg)<=0:
            return;
        if "connect_success:" in msg:
            self.current_user = msg[len("connect_success:"):]
        elif "ready:" in msg and "zw:" in msg :
            arr = msg.split(',')
            if len(arr)>=2:
                rd = arr[0].split(":")
                zw = arr[1].split(":")
                if len(rd)>=2 and len(zw)>=2:
                    uid = rd[1]
                    rm = zw[1]
                    self.current_user = uid;
                    self.info = rm+":"+uid;
                    self.room = rm[rm.find("room"):]
                    self.send_to_all(self, self.info)
                    self.send_to_same_room(self)
        elif "leftroom" in msg or "rightroom" in msg :
            self.info = msg+":"+str(self.current_user);
            self.send_to_all(self,msg+":"+str(self.current_user))
        elif "user:" in msg:
            type = msg.split(':')
            if type[2]=="btn":
                self.ready = type[3]
            self.send_same_room_info(self,msg)
        else:
            self.send_to_all(self, "sendmsg" + str(id(self))+":"+msg)

    def on_close(self):
        self.clients.remove(self)
        self.send_to_all(self, "close:"+self.info)

    def connectroom(self):
        self.info = ""
        self.room = ""
        self.ready = ""
        self.all_to_self(self)
        self.clients.add(self)

    def comeinroom(self):
        self.info = ""
        self.room = ""
        self.ready = ""
        self.clients.add(self)
