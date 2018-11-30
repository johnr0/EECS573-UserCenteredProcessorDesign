import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { SimulationTrial } from '../../../imports/collections/data';


class Survey extends Component{
    tasklist = [
        {'internet': 'browsing social media or internet'},
        {'music': 'streaming music'},
        {'video': 'streaming videos'},
        {'take/edit_photos_or_videos': 'taking or editing photos or videos'},
        {'navigate_map': 'navigating with map apps'},
        {'check_calendar_or_notes': 'check calendar and/or nots'},
    ]
    state={
        age:false,
        gender:false,
        internet:false,
        music:false,
        video:false,
        'take/edit_photos_or_videos':false,
        navigate_map:false,
        check_calendar_or_notes:false,
    }

    setTaskValue(id, event){
        var sel_state = {}
        sel_state[id] = true
        this.setState(sel_state)
        var {workerId, assignmentId, hitId} = this.props.match.params
        Meteor.call('simulationtrial.settasktime',  workerId, assignmentId, hitId, id, parseFloat(event.target.value))
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
    TaskQuestion(){
        
        return this.tasklist.map(dict => {
            var id = Object.keys(dict)[0]
            var phrase = dict[id]
            return ( <div key={id} onChange={this.setTaskValue.bind(this, id)}>
            <h5>For each day, how long do you use your cellphone for {phrase}?</h5>
            <input type='radio' id={id+'_0'} name={id} ref={id+'_0'} value='0'></input>
            <label htmlFor={id+'_0'}>0 hrs</label>
            <input type='radio' id={id+'_1'} name={id} ref={id+'_1'} value='30'></input>
            <label htmlFor={id+'_1'}>0 hrs to 1 hrs</label>
            <input type='radio' id={id+'_2'} name={id} ref={id+'_2'} value='90'></input>
            <label htmlFor={id+'_2'}>1 hrs to 2 hrs</label>
            <input type='radio' id={id+'_3'} name={id} ref={id+'_3'} value='150'></input>
            <label htmlFor={id+'_3'}>2 hrs to 3 hrs</label>
            <input type='radio' id={id+'_4'} name={id} ref={id+'_4'} value='210'></input>
            <label htmlFor={id+'_4'}>3 hrs to 4 hrs</label>
            <input type='radio' id={id+'_5'} name={id} ref={id+'_5'} value='270'></input>
            <label htmlFor={id+'_5'}>4 hrs to 5 hrs</label>
            <input type='radio' id={id+'_6'} name={id} ref={id+'_6'} value='330'></input>
            <label htmlFor={id+'_6'}>More than 5 hrs</label>     
        </div>)
        })
    }

    setGenderorAge(id, event){
        var sel_state = {}
        sel_state[id] = true
        this.setState(sel_state)
        var {workerId, assignmentId, hitId} = this.props.match.params
        console.log(id, event.target.value)
        Meteor.call('simulationtrial.setgenderorage', workerId, assignmentId, hitId, id, event.target.value)
    }

    completeSurvey(){
        console.log(this.refs)
    }

    render(){
        console.log(this.props.trial)
        if(this.props.trial !=undefined){
            return (<div style={{'textAlign':'center'}}>
                <h4>Survey for {this.props.trial.workerId}</h4>
                <div onChange={this.setGenderorAge.bind(this, 'gender')}>
                    <h5>What is your gender?</h5>
                    <div>
                        <input type='radio' id='female' name='gender' ref='female' value='female'></input>
                        <label htmlFor='female'>Female</label>
                        <input type='radio' id='male' name='gender' ref='male' value='male'></input>
                        <label htmlFor='male'>Male</label>
                        <input type='radio' id='other' name='gender' ref='other' value='other'></input>
                        <label htmlFor='other'>Other</label>
                    </div>
                </div>
                <div onChange={this.setGenderorAge.bind(this, 'age')}>
                    <h5>What is your age?</h5>
                    <div>
                        <input type='radio' id='age_17' name='age' ref='age_17' value='17'></input>
                        <label htmlFor='age_17'>17 or younger</label>
                        <input type='radio' id='age_18' name='age' ref='age_18' value='18_20'></input>
                        <label htmlFor='age_18'>18-20</label>
                        <input type='radio' id='age_21' name='age' ref='age_21' value='21_29'></input>
                        <label htmlFor='age_21'>21-29</label>
                        <input type='radio' id='age_30' name='age' ref='age_30' value='30_39'></input>
                        <label htmlFor='age_30'>30-39</label>
                        <input type='radio' id='age_40' name='age' ref='age_40' value='40_49'></input>
                        <label htmlFor='age_40'>40-49</label>
                        <input type='radio' id='age_50' name='age' ref='age_50' value='50_59'></input>
                        <label htmlFor='age_50'>50-59</label>
                        <input type='radio' id='age_60' name='age' ref='age_60' value='60'></input>
                        <label htmlFor='age_60'>60 or older</label>
                    </div>
                </div>
                {this.TaskQuestion()}

                <Link to={'/simulation/'+this.props.match.params.workerId+'/'+this.props.match.params.assignmentId+'/'+this.props.match.params.hitId}
                className={"btn "+(this.Proceedable() ? "": "disabled")} onClick={this.completeSurvey.bind(this)} >Proceed
                </Link>
            </div>)
        }else{
            return (<div></div>)
        }
    }
}

export default createContainer((props) => {
    const {workerId, assignmentId, hitId} = props.match.params;
    Meteor.subscribe('simulationtrial', {})
    return {trial: SimulationTrial.findOne({workerId, assignmentId, hitId})}
}, Survey)