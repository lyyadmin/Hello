'''
Created on 2017年12月7日

@author: admin
'''
from model import models

class Chart(models.Model):
    def __init__(self):
        models.Model.__init__(self,self.__class__.__name__)
    def chart_list(self):
        return self.list_data()
Chart = Chart()
# print(Chart.chart_list())