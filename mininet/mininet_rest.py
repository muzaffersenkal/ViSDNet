#!/usr/bin/python
from bottle import Bottle, request,response
import time
from random import randint
import json

"""
MininetRest adds a REST API to mininet.

"""

__author__ = 'Carlos Giraldo'
__copyright__ = "Copyright 2015, AtlantTIC - University of Vigo"
__credits__ = ["Carlos Giraldo"]
__license__ = "GPL"
__version__ = "0.0.1"
__maintainer__ = "Carlos Giraldo"
__email__ = "carlitosgiraldo@gmail.com"
__status__ = "Prototype"

class EnableCors(object):
    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

            if request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)
        return _enable_cors

class MininetRest(Bottle):
    def __init__(self, net):
        super(MininetRest, self).__init__()
        self.net = net
        
        self.route('/nodes', callback=self.get_nodes)
        self.route('/nodes/<node_name>', callback=self.get_node)
        self.route('/nodes/<node_name>/delete', method='GET', callback=self.delete_node)
        self.route('/nodes/<node_name>', method='POST', callback=self.post_node)
        self.route('/nodes/<node_name>/cmd', method='POST', callback=self.do_cmd)
        self.route('/nodes/<node_name>/<intf_name>', method='GET' ,callback=self.get_intf)
        self.route('/nodes/<node_name>/<intf_name>', method='POST', callback=self.post_intf)
        self.route('/hosts', method='GET', callback=self.get_hosts)
        self.route('/add-host/<host_name>', method='GET', callback=self.add_host)
        self.route('/switches', method='GET', callback=self.get_switches)
        self.route('/links', method='GET', callback=self.get_links)
        self.route('/create-topology',method='GET',callback=self.create_topology)
        self.install(EnableCors())
        
    def delete_node(self,node_name):
     
        #self.net.delNode(node=node_name)
        return {}

    def add_host(self,host_name):
        self.net.addHost(host_name)
        return {}
        
    def create_topology(self):
        nodes= [dict(name=h.name,type="esnet_site",x=randint(0, 10)*10,y=randint(0, 10)*10) for h in self.net.hosts]
        edges = [dict(source=l.intf1.node.name, target=l.intf2.node.name,capacity="10G") for l in self.net.links]
        switches = [dict(name=s.name,type="hub",x=randint(0, 10)*10,y=randint(0, 10)*10) for s in self.net.switches]
        for s in switches:
            nodes.append(s)
       
        return  {
                "description": "Simple topo",
                "name": "simple",
                "nodes":  nodes,
                "edges": edges
       
                }

    def get_nodes(self):
        return {'nodes': [n for n in self.net]}

    

    def get_node(self, node_name):
        node = self.net[node_name]
        
        return {'intfs': [i.name for i in node.intfList()], 'params': node.params,'name':node_name,}

    def post_node(self, node_name):
        node = self.net[node_name]
        node.params.update(request.json['params'])


    def get_intf(self, node_name, intf_name):
        node = self.net[node_name]
        intf = node.nameToIntf[intf_name]
        print("param")
        print(intf.params['intf'].__dict__)
        print("------22")
        print(intf.__dict__)
        print("------33")

        
        print(intf.link)
        return {'name': intf.name, 'ip': intf.ip, 'mac': intf.mac, 'status': 'up' if intf.name in intf.cmd('ifconfig') else 'down',"params": json.dumps({'ss':'sss'})}

    def post_intf(self, node_name, intf_name):
        node = self.net[node_name]
        intf = node.nameToIntf[intf_name]
        if 'status' in request.json:
            intf.ifconfig(request.json['status'])
        if 'params' in request.json:
            intf_params = request.json['params']
            intf.config(**intf_params)
            intf.params.update(intf_params)

    def get_hosts(self):
        
        return {'hosts': [h.name for h in self.net.hosts]}

    def get_switches(self):
        return {'switches': [s.name for s in self.net.switches]}

    def get_links(self):
        return {'links': [dict(name=l.intf1.node.name + '-' + l.intf2.node.name,
                               node1=l.intf1.node.name, node2=l.intf2.node.name,
                               intf1=l.intf1.name, intf2=l.intf2.name) for l in self.net.links]}

    def do_cmd(self, node_name):
        args = request.body.read()
        node = self.net[node_name]
        rest = args.split(' ')
        # Substitute IP addresses for node names in command
        # If updateIP() returns None, then use node name
        rest = [self.net[arg].defaultIntf().updateIP() or arg
                if arg in self.net else arg
                for arg in rest]
        rest = ' '.join(rest)
        # Run cmd on node:
        node.sendCmd(rest)
        output = ''
        init_time = time.time()
        while node.waiting:
            exec_time = time.time() - init_time
            #timeout of 5 seconds
            if exec_time > 5:
                break
            data = node.monitor(timeoutms=1000)
            output += data
        # Force process to stop if not stopped in timeout
        if node.waiting:
            node.sendInt()
            time.sleep(0.5)
            data = node.monitor(timeoutms=1000)
            output += data
            node.waiting = False
        return output
