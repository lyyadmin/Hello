#!/usr/bin/python
#coding=utf-8

import tornado.httpserver
import tornado.ioloop
from tornado.options import define, options
import tornado.options
import tornado.web
import torndb

import config
import route
import settings


define("port", default=config.configs["port"], help="run on the given port", type=int)
define("mysql_host", default=config.configs["database"]["hostname"], help="db host")
define("mysql_port", default=config.configs["database"]["port"], help="db port")
define("mysql_database", default=config.configs["database"]["database"], help="db name")
define("mysql_user", default=config.configs["database"]["username"], help="db user")
define("mysql_password", default=config.configs["database"]["password"], help="db password")

class Application(tornado.web.Application):
    def __init__(self):
        tornado.web.Application.__init__(self, route.urls, **settings.settings)
        print(options.mysql_host)
        print(options.mysql_port)
        print(options.mysql_database)
        print(options.mysql_user)
        print(options.mysql_password)
        self.db = torndb.Connection(
            host = options.mysql_host+":"+str(options.mysql_port),
            database = options.mysql_database,
            user = options.mysql_user, 
            password = options.mysql_password
        )


def main():
    tornado.options.parse_command_line()
    app = tornado.httpserver.HTTPServer(Application())
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
