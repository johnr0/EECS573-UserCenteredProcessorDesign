import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { SimulationTrial } from '../../../imports/collections/data';
import {Link} from 'react-router-dom';

class SelfEvaluation extends Component{
    state={
        batterySatisfaction: false,
        chargeCountExpectation: false,
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
                            <h5>Based on your virtual agent’s phone usage, we predict that you would need to charge your phone between {this.props.trial.SimulationResult.chargeCount-1} and {this.props.trial.SimulationResult.chargeCount+1} times in a day.</h5>
                            <h5>How satisfied would you be with the phone’s performance?</h5>
                            <div onChange={this.setTaskValue.bind(this,'batterySatisfaction')}>
                                <input type='radio' id='charge_count_vu' name='charge_count' value='0'></input>
                                <label htmlFor='charge_count_vu'>Highly dissatisfied</label>
                                <input type='radio' id='charge_count_u' name='charge_count' value='1'></input>
                                <label htmlFor='charge_count_u'>Dissatisfied</label>
                                <input type='radio' id='charge_count_n' name='charge_count' value='2'></input>
                                <label htmlFor='charge_count_n'>Neutral</label>
                                <input type='radio' id='charge_count_l' name='charge_count' value='3'></input>
                                <label htmlFor='charge_count_l'>Satisfied</label>
                                <input type='radio' id='charge_count_vl' name='charge_count' value='4'></input>
                                <label htmlFor='charge_count_vl'>Highly satisfied</label>
                            </div>
                            <div>
                                <h5>Based on your phone usage, how many times in a day do you think you would recharge your phone?</h5>
                                <div className="input-field" style={{'width':'10%', 'margin':'auto'}} onChange={this.setTaskValue.bind(this,'chargeCountExpectation')}> 
                                <input type='number' id='chargeCountExpectation' name='charge_count_expect' ></input>
                                <label htmlFor='chargeCountExpectation'>Answer here</label>
                                </div>
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