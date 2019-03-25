#!/usr/bin/python
#coding=utf-8
import os

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "templates")
STATIC_PATH = os.path.join(os.path.dirname(__file__), "static")
debugger = True
# debugger = False



settings = dict(
            template_path = TEMPLATE_PATH, 
            static_path = STATIC_PATH, 
            debug = debugger
        )