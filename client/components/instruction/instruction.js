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
            <p>Write your name and proceed to the survey by clicking the button below.</p>
            <input type='text' ref='workerId' onChange={this.handleworkerId.bind(this)}></input>
            <Link to={'/survey/'+this.state.workerId+'/'+this.state.assignmentId+'/'+this.state.hitId} className="btn"
            onClick={this.GenerateSimulation.bind(this)}>
            Proceed</Link>
        </div>
            
        )
    }
}

export default Instruction