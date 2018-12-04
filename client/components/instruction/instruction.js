import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
 
class Instruction extends Component{
    state={
        workerId:''
    }
    componentDidMount(){
        this.state.assignmentId= Math.random().toString(36).substring(7);
        this.state.hitId = Math.random().toString(36).substring(7);
    }
    handleworkerId(){
        this.setState({workerId: this.refs.workerId.value})
    }
    GenerateSimulation(){
        Meteor.call('simulationtrial.create', this.state.workerId, this.state.assignmentId, this.state.hitId)
    }
    render() {
        
        return (<div style={{'textAlign':'center'}}>
            <h4>Instruction</h4>
            <p>Write your name BEFORE you proceed to the simulation</p>
            <div className="input-field">
                <input id="name" className="validate" type='text' ref='workerId' onChange={this.handleworkerId.bind(this)}></input>
                <label htmlFor="name">Your Name</label>
            </div>
            <Link to={'/survey/'+this.state.workerId+'/'+this.state.assignmentId+'/'+this.state.hitId} className="btn"
            onClick={this.GenerateSimulation.bind(this)} placeholder="Write your name here">
            Proceed</Link>
        </div>
            
        )
    }
}

export default Instruction