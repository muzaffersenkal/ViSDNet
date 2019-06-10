from mininet.net import Mininet
from mininet.link import TCLink
from mininet.node import OVSController
from mininet_rest import MininetRest
from mininet.topo import SingleSwitchTopo

net = Mininet(topo=SingleSwitchTopo(k=5),controller=OVSController,link=TCLink)

net.start()
mininet_rest = MininetRest(net)
mininet_rest.run(host='0.0.0.0', port=8080, debug=True)
net.stop()
