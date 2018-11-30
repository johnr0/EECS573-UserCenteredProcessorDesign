import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { SimulationTrial } from '../../../imports/collections/data';

class List extends Component{

    deletedatum(workerId, assignmentId){
        Meteor.call('simulationtrial.delete', workerId, assignmentId)
    }

    renderList(){
        return this.props.trial.map(ele=>{
            return ( <li key={ele.workerId+"_"+ele.assignmentId}>
                <div className="collapsible-header">
                    <p>{ele.workerId} / {ele.assignmentId}
                        <span className="btn" style={{"backgroundColor":"red", "marginLeft": "20px"}} onClick={this.deletedatum.bind(this, ele.workerId, ele.assignmentId)}>
                         Del
                        </span>
                    </p>
                </div>
                <div className="collapsible-body">
                    <ul>
                        <li>
                            Choosen Arm: {ele.Arm}
                        </li>
                        <li>
                            Success Rate: {ele.SimulationResult.successRate}
                        </li>
                        <li>
                            Gender: {ele.SurveyResult.gender}
                        </li>
                        <li>
                            Age: {ele.SurveyResult.age}
                        </li>
                    </ul>
                </div>  
            </li>
            )
        })
    }
    render(){
        var data = 'text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(this.props.trial))
        if(data!=undefined){
            console.log(data)
            return (
                <div>
                    <h4>Input List</h4>
                    <div>
                        <ul className="collapsible">
                            {this.renderList()}
                        </ul>
                        
                    </div>
                    <div>
                        <a className='btn' href={"data: "+data} download="data.json">Download data</a>
                    </div>
                </div>
            )
        }else{
            return (<div></div>)
        }
        
    }
}

export default createContainer((props) => {
    Meteor.subscribe('simulationtrial', {})
    return {trial: SimulationTrial.find({}).fetch()}
}, List)