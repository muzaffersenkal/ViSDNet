import React from 'react';
import './App.css';
import { TrafficMap } from "react-network-diagrams";
import Panel from './components/Panel'
import axios from 'axios';




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


class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      topology :  {},
      loading:true,
      selection : {
        edges:[],
        nodes:[]
      },
      modal:false
    }
  }
  
  onSelectionChange(s,e){
    this.setState({
      modal:true
    })
    console.log(s,e)
  }
  componentDidMount(){
    console.log("istek atılıyor")
    axios.get("http://localhost:8080/create-topology")
    .then(data =>  this.setState({topology: data.data ,loading:false}))
  }

  render(){
    const loading = this.state.loading;
    const {modal} = this.state
  return (
   <div className="App">
   
      <header className="App-header">
      {!loading ? <div><Panel open={modal} />
        <TrafficMap
            autoSize={false}
            bounds={{x1: 0, y1: 0, x2: 200, y2: 150}}
            topology={this.state.topology}
            stylesMap={stylesMap}
            edgeColorMap={edgeColorMap}
            selection={this.state.selection}
            onSelectionChange={(s,e) => this.onSelectionChange(s,e)}
            edgeDrawingMethod="bidirectionalArrow" /> </div>: <div>Creating Network Topology...</div> }
      
      </header>
    </div>
  );
}
}

export default App;
