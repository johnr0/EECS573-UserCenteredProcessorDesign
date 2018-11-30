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
                            Gender: {ele.SurveyResult.gender}
                        </li>
                        <li>
                            Age: {ele.SurveyResult.age}
                        </li>
                        <li>
                            Internet: {ele.SurveyResult.tasklist.internet.accomplished}/{ele.SurveyResult.tasklist.internet.time}
                        </li>
                        <li>
                            Music: {ele.SurveyResult.tasklist.music.accomplished}/{ele.SurveyResult.tasklist.music.time}
                        </li>
                        <li>
                            Video: {ele.SurveyResult.tasklist.video.accomplished}/{ele.SurveyResult.tasklist.video.time}
                        </li>
                        <li>
                            Take/edit photos or videos: {ele.SurveyResult.tasklist['take/edit_photos_or_videos'].accomplished}/{ele.SurveyResult.tasklist['take/edit_photos_or_videos'].time}
                        </li>
                        <li>
                            Navigate Map: {ele.SurveyResult.tasklist.navigate_map.accomplished}/{ele.SurveyResult.tasklist.navigate_map.time}
                        </li>
                        <li>
                            Check calendar or notes: {ele.SurveyResult.tasklist.check_calendar_or_notes.accomplished}/{ele.SurveyResult.tasklist.check_calendar_or_notes.time}
                        </li>
                        <li>
                            class A: {ele.SurveyResult.tasklist.class_A.accomplished}/{ele.SurveyResult.tasklist.class_A.time}
                        </li>
                        <li>
                            class B: {ele.SurveyResult.tasklist.class_B.accomplished}/{ele.SurveyResult.tasklist.class_B.time}
                        </li>
                        <li>
                            class C: {ele.SurveyResult.tasklist.class_C.accomplished}/{ele.SurveyResult.tasklist.class_C.time}
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