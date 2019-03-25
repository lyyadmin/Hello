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
define("mysql_host", default="localhost:3306", help="db host")
define("mysql_database", default="markway", help="db name")
define("mysql_user", default="root", help="db user")
define("mysql_password", default="root", help="db password")

class Application(tornado.web.Application):
    def __init__(self):
        tornado.web.Application.__init__(self, route.urls, **settings.settings)
        self.db = torndb.Connection(
            host = options.mysql_host, 
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
