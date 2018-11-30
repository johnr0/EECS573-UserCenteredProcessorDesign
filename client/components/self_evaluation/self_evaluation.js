import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { SimulationTrial } from '../../../imports/collections/data';
import {Link} from 'react-router-dom';

class SelfEvaluation extends Component{
    state={
        batterySatisfaction: false,
    }

    setTaskValue(id, event){
        var sel_state = {}
        sel_state[id] = true
        this.setState(sel_state)
        var {workerId, assignmentId, hitId} = this.props.match.params
        console.log('setting')
        Meteor.call('selfevaluation',  workerId, assignmentId, hitId, id, parseFloat(event.target.value))
    }

    Proceedable(){
        var proceed=true
        for(var i in this.state){
            if(this.state[i]==false){
                proceed=false
            }
        }
        return proceed
    }

    render() {
        console.log(this.props.trial)
        if(this.props.trial!=undefined){
            return (
                <div style={{'display':'block', 'margin':'auto'}}>
                    <h3 style={{'textAlign':'center'}}>
                        User Experience Survey    
                        <div>
                            <h5>Based on your daily activity, you would have needed to charge {this.props.trial.SimulationResult.chargeCount} times a day</h5>
                            <h5>How likely are you going to say "I am satisfied with it."?</h5>
                            <div onChange={this.setTaskValue.bind(this,'batterySatisfaction')}>
                                <input type='radio' id='charge_count_vu' name='charge_count' value='0'></input>
                                <label htmlFor='charge_count_vu'>Very Unlikely</label>
                                <input type='radio' id='charge_count_u' name='charge_count' value='1'></input>
                                <label htmlFor='charge_count_u'>Unlikely</label>
                                <input type='radio' id='charge_count_n' name='charge_count' value='2'></input>
                                <label htmlFor='charge_count_n'>Neutral</label>
                                <input type='radio' id='charge_count_l' name='charge_count' value='3'></input>
                                <label htmlFor='charge_count_l'>Likely</label>
                                <input type='radio' id='charge_count_vl' name='charge_count' value='4'></input>
                                <label htmlFor='charge_count_vl'>Very Likely</label>
                            </div>
                        </div>
                        <div>
                            <Link className={"btn "+(this.Proceedable() ? "": "disabled")} to={"/end/"}>End the task</Link>
                        </div>
                    </h3>
                </div>
                
            )
        }else{
            return (<div></div>)
        }
        
    }
}

export default createContainer((props) => {
    const {workerId, assignmentId, hitId} = props.match.params;
    Meteor.subscribe('simulationtrial', {})
    return {trial: SimulationTrial.findOne({workerId, assignmentId, hitId})}
}, SelfEvaluation)