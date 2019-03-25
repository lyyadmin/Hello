'''
Created on 2017年12月7日

@author: admin
'''
from model import models

class Menu(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def menu_list(self,num=-1):
        wh = ""
        if num !=-1:
            wh = "where m_number="+str(num)
        return self.list_data(where=wh)
    def get_menu(self,u):
        li = self.menu_list(0)
        lic = self.menu_list(1)
        menus = []
        for i in li:
            if u['isadmin']==0:
                if i['m_value']=="user_manager":
                    continue
            chs = []
            for it in lic:
                if it['node_value'] == i['m_value']:
                    chs.append(it)
            i['children_menu'] = chs
            menus.append(i)
        return menus
Menu = Menu()
# print(Menu.get_menu())