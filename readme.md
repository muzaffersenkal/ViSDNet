
## Abstraction

MiniVis is a project that provides us to modify and visualize mininet network in real-time.
MiniVis contains all necessary components for starting network flows dynamically, visualizing
and modifying network topology. MiniVis allows to monitoring and modifying to mininet
network dynamically. MiniVis provides a powerful environment for debugging network
protocols or learning, teaching, and understanding network concepts.

## Background

MiniVis will be developing with Python and Vuejs. When MiniVis is launched, it loads the
Mininet network topology. There is a rest api to communicate Gui and mininet. The Gui
shows us network devices and links. When a node is clicked, detailed information about that
node will be show and new settings can be made where is opened new window. Settings
entered on Gui side will be transferred to mininet terminal via rest api. The settings
converted to codes will be applied in the terminal and the new topology will be displayed in
the user interface.


## Summary

Increasing numbers of connected devices means a deluge of network traffic. SDN helps us
to optimize our network. SDN controllers present us to visualize the network but do not
provide the possibility to set..But with using MiniVis, it is possible to modify and observe your
network in real-time.

