#!/usr/bin/python
#coding=utf-8

from controller.user import UserController
from controller.index import IndexController
from controller.html import HtmlController
from controller.permission import PermissionController
from controller.database import DatabaseController
from controller.role import RoleController
from controller.models import ModelController
from controller.app import AppController
from controller.workflow import WorkflowController
from controller.ws import WebsocketController
from controller.gamemanager import GameManagerController
urls = [
            (r"/user/(.*)", UserController), 
            (r"/per/(.*)", PermissionController), 
            (r"/role/(.*)", RoleController), 
            (r"/data/(.*)", DatabaseController), 
            (r"/model/(.*)", ModelController), 
            (r"/app/(.*)", AppController), 
            (r"/workflow/(.*)", WorkflowController),
            (r"/ws/(.*)", WebsocketController),
            (r"/game/(.*)", GameManagerController),
            (r'/(.*)', HtmlController), 
            (r"/", IndexController), 
        ]