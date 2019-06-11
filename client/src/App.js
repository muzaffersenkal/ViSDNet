import React from 'react';
import './App.css';
import { TrafficMap } from "react-network-diagrams";

import axios from 'axios';
import { Button, Header,Input, Container, Modal, Menu,
  Sidebar,Divider,Grid,Label,Checkbox,
  Responsive,Dropdown} from 'semantic-ui-react'

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

const IType = [  {
  key: "TCP",
  text: "TCP",
  value: "TCP"
},
{
  key: "UDP",
  text: "UDP",
  value: "UDP"
}]



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
      input:[],
      selectedType: "",
      selected: {},
      addHost: '',
      selectedClient: '',
      loadingTest: false,
      testResult: '',
      protocol: '',
      bandwidth:'',
      
   
    }
  }
  closeModalHandler(){
    this.setState({
      modal:false,     
      input:[],
      selectedType: "",
      selected: {},
      addHost: '',
      selectedClient: '',
      loadingTest: false,
      testResult: '',
      protocol: '',
      bandwidth:'',
    })
  }

  startTest(){
    this.setState({
     loadingTest:true
    }, () => {
      const server = this.state.selected.name;
      const client = this.state.selectedClient;
      const protocol = this.state.protocol;
      axios.post(`http://localhost:8080/bandwidth/${protocol}/${server}/${client}`)
      .then(data => {
        console.log(data)
        this.setState({
          testResult:data.data.performance,
          loadingTest:false})
         
         } 
       
      )


    })
   

  }
  changeBandwidth(name){

    this.setState({
      loadingTest:true
     }, () => {
      const bandwidth = this.state.bandwidth
      
       axios.get(`http://localhost:8080/links/set/${name}/${bandwidth}`)
       .then(data => {
         console.log(data)
         this.setState({
         
           loadingTest:false})
          
          } 
        
       )
 
 
     })

  }

  startTestLatency(){
    this.setState({
     loadingTest:true
    }, () => {
      const server = this.state.selected.name;
      const client = this.state.selectedClient;
     
      axios.post(`http://localhost:8080/latency/${server}/${client}`)
      .then(data => {
        console.log(data)
        this.setState({
          testResult:data.data.result,
          loadingTest:false})
         
         } 
       
      )


    })
   

  }

  onChange = e =>{
    const { name , value} = e.target;
    this.setState({
        [name]: value
    })
};
 
  hostListForBandwidth = (name) =>{
    console.log("test")
    const hosts = this.state.topology.nodes;
    const hostsNew = [];
     hosts.filter( h =>  name !== h.name).forEach(e => {
        hostsNew.push(  {
          key: e.name,
          text: e.name,
          value: e.name
        })
     });
     console.log(hostsNew);

     return hostsNew;
  }
  addHost(){
    let name = this.state.addHost
    axios.get(`http://localhost:8080/add-host/${name}`)
    .then(data =>  
      console.log("eklendi")
    )
  }

  DropdownSelected = (event, {value}) => {
    this.setState({
      selectedClient:value
      
    })
  
}

protocolSelected = (event, {value}) => {
  this.setState({
    protocol:value
    
  })

}


  onSelectionChange(element,name){
    
    
      if(element === 'node'){
        axios.get(`http://localhost:8080/nodes/${name}`)
        .then(data =>  
          this.setState({
            selected:data.data,
            selectedType:"node",
            modal:true
          })
        )
       
      }else if ( element == 'edge') {
        let splited = name.split('--')
        axios.get(`http://localhost:8080/links/${splited[0]}/${splited[1]}`)
        .then(data =>  {
          console.log(data)
          this.setState({
            selected:data.data.interfaces,
            selectedType:"edge",
            modal:true
          })
        }
          
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
    const {modal} = this.state;
    const  selectedType = this.state.selectedType;
    const selected = this.state.selected;
    const  testResult = this.state.testResult;
    const loadingTest = this.state.loadingTest;
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
      {/* <Input placeholder='host name' size={"small"} name="addHost" onChange={this.onChange} value={this.state.addHost}  />
      <Button onClick={()=>this.addHost()}>ADD HOST</Button> */}
      {!loading ? <div>
        { modal ?<Modal open={modal}>
    <Modal.Header>{selectedType == "node" ? "Node" : "Edge" } Information</Modal.Header>
    <Modal.Content>
     
   
        
      { selectedType == "node" ? 
        <Modal.Description>


           <Header>Header</Header>
           <p>You can update node information that you select.</p>
           {/* ----- Node Modal Content--------- */} 

           <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                <Divider horizontal>Test Bandwidth</Divider>
                            <Dropdown
                      placeholder='Select a Host'
                      fluid
                      selection
                      onChange={(e,value) => this.DropdownSelected(e,value)}
                      options={this.hostListForBandwidth(this.state.selected.name)}
                    />

                  <Dropdown
                      placeholder='Select Internet Protocol'
                      fluid
                      selection
                      onChange={(e,value) => this.protocolSelected(e,value)}
                      options={IType}
                    />
                    <br></br>
                    <Button secondary onClick={()=>this.startTest()}>Start Test</Button>
                          
                </Grid.Column>
                <Grid.Column>
                    <Divider horizontal>Test Latency</Divider>
                    <Dropdown
                      placeholder='Select a Host'
                      fluid
                      selection
                      onChange={(e,value) => this.DropdownSelected(e,value)}
                      options={this.hostListForBandwidth(this.state.selected.name)}
                    />
                  <br></br>
                  <Button secondary onClick={()=>this.startTestLatency()}>Start Test</Button>
                 
                </Grid.Column>
        
              </Grid.Row>

              <Grid.Row>
              { loadingTest ? <div>Test started, it may take some while...</div>: ''}
                          {testResult !== '' ? testResult :''}
              </Grid.Row>

             </Grid>
     
<Divider horizontal>Info</Divider>
  
          <Input placeholder='NAME' value={this.state.selected.name}  />
          <Input placeholder='IP ADDRESS' value={this.state.selected.params.ip} />
          <Input placeholder='MAC ADDRESS' />
          <p>be careful while you're filling</p>
          <Button.Group>
            <Button onClick={()=>this.closeModalHandler()}>CLOSE</Button>
            <Button.Or text='&' />
            <Button positive>SAVE</Button>
         </Button.Group> 
        </Modal.Description>:
  
        <Modal.Description>

         {/* ----- Edge Modal Content--------- */} 
          <Header>Header</Header>
          <p>You can update interfaces information that you select.</p>

          {selected ? selected.map(s => (
              <Grid.Row key={s.name}>
                <Divider horizontal> {s.status ?  
                            <Label as='a' color='teal' tag>
                  {s.name} Interface is Up
                </Label>:     <Label as='a' color='red' tag>
                {s.name} Interface is Down
                </Label>
          } </Divider>

    <p>Change Status :      <Checkbox toggle checked={s.status} onChange={() => this.onChangeStatus(s.name)}/></p> 
     
      <p>You can set the bandwith of this interface </p>
          
          <Input placeholder='BANDWIDTH' name="bandwidth" onChange={this.onChange}   /> 
          <Button secondary onClick={()=>this.changeBandwidth(s.name)}>Set</Button>
          <br></br>
                          
          </Grid.Row>
                
          )):''}
         
         
      
         { loadingTest ? <div>It's updating, it may take some while...</div>: ''}
                          
        
          <br></br>
         <Button.Group>
            <Button onClick={()=>this.closeModalHandler()}>CLOSE</Button>
            <Button.Or text='&' />
            <Button positive>SAVE</Button>
          </Button.Group>


        </Modal.Description> }
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
