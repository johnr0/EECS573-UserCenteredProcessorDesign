import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { SimulationTrial } from '../../../imports/collections/data';

class SelfEvaluation extends Component{

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
                            <div>
                                <input type='radio' id='charge_count_vu' name='charge_count'></input>
                                <label htmlFor='charge_count_vu'>Very Unlikely</label>
                                <input type='radio' id='charge_count_u' name='charge_count'></input>
                                <label htmlFor='charge_count_u'>Unlikely</label>
                                <input type='radio' id='charge_count_n' name='charge_count'></input>
                                <label htmlFor='charge_count_n'>Neutral</label>
                                <input type='radio' id='charge_count_l' name='charge_count'></input>
                                <label htmlFor='charge_count_l'>Likely</label>
                                <input type='radio' id='charge_count_vl' name='charge_count'></input>
                                <label htmlFor='charge_count_vl'>Very Likely</label>
                            </div>
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