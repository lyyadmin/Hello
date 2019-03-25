'''
Created on 2017年12月7日

@author: admin
'''
from model import models

class Operate(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def operate_list(self):
        return self.list_data()
Operate = Operate()
# print(Operate.operate_list())