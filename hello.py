#!/usr/bin/env python
# -*- coding:utf-8 -*-
#
#    Authhor    :Eric.Tang
#    Email    :jeepxiaozi66@gmail.com
#    Date    :13/06/02 22:17:57
#    Desc    :hello,world of tornado
#

import time,uuid
import socket,os
ed = time.mktime(time.strptime("2017-12-12 13:48:32",'%Y-%m-%d %H:%M:%S'))

uid = str(uuid.uuid3(uuid.NAMESPACE_DNS, 'python.org'))
print(uid)

hostname = socket.gethostname()
print(hostname)
ip = socket.gethostbyname(hostname)
print(ip)

def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip
print(get_host_ip())