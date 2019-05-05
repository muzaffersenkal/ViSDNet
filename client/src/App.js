import React from 'react';
import './App.css';
import { TrafficMap } from "react-network-diagrams";

import axios from 'axios';
import { Button, Header,Input, Container, Modal, Menu,
  Sidebar,
  Responsive } from 'semantic-ui-react'

  import NavBar from './components/Navbar'




const edgeColorMap = [
  {color: "#990000", label: ">=50 Gbps", range: [50, 100]},
  {color: "#bd0026", label: "20 - 50", range: [20, 50]},
  {color: "#cc4c02", label: "10 - 20", range: [10, 20]},
  {color: "#016c59", label: "5 - 10", range: [5, 10]},
  {color: "#238b45", label: "2 - 5", range: [2, 5]},
  {color: "#3690c0", label: "1 - 2", range: [1, 2]},
  {color: "#74a9cf", label: "0 - 1", range: [0, 1]}
];
const hubStyle = {
  node: {
      normal: {fill: "#10B67F",stroke: "#10B67F",strokeWidth: 24, cursor: "pointer"},
      selected: {fill: "#37B6D3", stroke: "rgba(55, 182, 211, 0.22)",
                 strokeWidth: 10, cursor: "pointer"},
      muted: {fill: "#CBCBCB", stroke: "#BEBEBE", opacity: 0.6,
              cursor: "pointer"}
  },
  label: {
      normal: {fill: "#696969", stroke: "none", fontSize: 9},
      selected: {fill: "#333",stroke: "none", fontSize: 11},
      muted: {fill: "#696969", stroke: "none", fontSize: 8,
      opacity: 0.6}
  }
};
const siteStyle = {
    node: {
        normal: {fill: "#CBCBCB",stroke: "#CBCBCB", strokeWidth: 17,cursor: "pointer"},
        selected: {fill: "#37B6D3", stroke: "rgba(55, 182, 211, 0.22)",
                   strokeWidth: 10, cursor: "pointer"},
        muted: {fill: "#CBCBCB", stroke: "#BEBEBE", opacity: 0.6,
                cursor: "pointer"}
    },
    label: {
        normal: {fill: "#696969", stroke: "none", fontSize: 9},
        selected: {fill: "#333",stroke: "none", fontSize: 11},
        muted: {fill: "#696969", stroke: "none", fontSize: 8,
        opacity: 0.6}
    }
};


const stylesMap = {
  "hub": hubStyle,
  "esnet_site": siteStyle
};

const initialSelection= {
  edges:[],
  nodes:[]
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      topology :  {},
      loading:true,
      selection : initialSelection,
      modal:false,
      selected: {},
      addHost: ''
    }
  }
  closeModalHandler(){
    this.setState({
      modal:false
    })
  }

  onChange = e =>{
    const { name , value} = e.target;
    this.setState({
        [name]: value
    })
};
  addHost(){
    let name = this.state.addHost
    axios.get(`http://localhost:8080/add-host/${name}`)
    .then(data =>  
      console.log("eklendi")
    )
  }
  onSelectionChange(element,name){
      if(element === 'node'){
        axios.get(`http://localhost:8080/nodes/${name}`)
        .then(data =>  
          this.setState({
            selected:data.data,
            modal:true
          })
        )
      }

      
    
    console.log(element,name)
  }
  componentDidMount(){
    console.log("istek atılıyor")
    axios.get("http://localhost:8080/create-topology")
    .then(data =>  this.setState({topology: data.data ,loading:false}))
  }

  render(){
    const loading = this.state.loading;
    const {modal} = this.state
    const leftItems = [
      { as: "a", content: "Home", key: "home" },
      { as: "a", content: "About This Project", key: "about" }
    ];
    const rightItems = [
      { as: "a", content: "GitHub Page", key: "github" },
     
    ];
  return (
   <div className="App">
     <header className="App-header">
      <NavBar leftItems={leftItems} rightItems={rightItems} >
   
   </NavBar>
      <Container>
      <Input placeholder='host name' size={"small"} name="addHost" onChange={this.onChange} value={this.state.addHost}  />
      <Button onClick={()=>this.addHost()}>ADD HOST</Button>
      {!loading ? <div>
        { modal ?<Modal open={modal}>
    <Modal.Header>Node Information</Modal.Header>
    <Modal.Content >
     
      <Modal.Description>
        <Header>Header</Header>
        <p>You can update nodes information that you select.</p>
        <Input placeholder='NAME' value={this.state.selected.name}  />
        <Input placeholder='IP ADDRESS' value={this.state.selected.params.ip} />
        <Input placeholder='MAC ADDRESS' />
        <p>be careful while you're filling</p>
        <Button.Group>
    <Button onClick={()=>this.closeModalHandler()}>CLOSE</Button>
    <Button.Or text='&' />
    <Button positive>SAVE</Button>
  </Button.Group>
      </Modal.Description>
    </Modal.Content>
  </Modal> : '' }
        <TrafficMap
            autoSize={false}
            bounds={{x1: 0, y1: 0, x2: 200, y2: 150}}
            topology={this.state.topology}
            stylesMap={stylesMap}
            edgeColorMap={edgeColorMap}
            selection={this.state.selection}
            onSelectionChange={(e,n) => this.onSelectionChange(e,n)}
            edgeDrawingMethod="bidirectionalArrow" /> </div>: <div>Creating Network Topology...</div> }
      
      </Container>
      </header>
    </div>
  );
}
}

export default App;
