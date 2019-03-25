class Cache:
    _shared_state={}
    def __new__(cls,*args,**kwargs):
        obj=super(Cache,cls).__new__(cls,*args,**kwargs)
        obj.__dict__=cls._shared_state
        return obj
    def __init__(self):
        print("INIT model Cache !")
    def set(self,key,value):
        self._shared_state[key] = value
    def get(self,key,default):
        if key in self._shared_state.keys():
            return self._shared_state[key]
        return default
    def clear(self,key):
        if self._shared_state.has_key(key):
            del self._shared_state[key]
Cache = Cache()