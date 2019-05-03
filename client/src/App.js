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

class App extends React.Component {

  constructor(props){
    super(props);
    this.state= {
      topology :  {}
    }
  }
  
  componentDidMount(){
    axios.get("http://localhost:8080/create-topology")
    .then(data =>  this.setState({topology: data.data }))
  }

  render(){
    
  return (
    <div className="App">
      <header className="App-header">
      <Panel />
        <TrafficMap
        autoSize={false}
            bounds={{x1: 0, y1: 0, x2: 200, y2: 150}}
            topology={this.state.topology}
            edgeColorMap={edgeColorMap}
            onSelectionChange={(e,s) => console.log(s)}
            edgeDrawingMethod="bidirectionalArrow" />
      </header>
    </div>
  );
}
}

export default App;
