import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    // TODO data structure that stores model info with user info

        // TODO data structure should include the thread of user evaluation data
    'simulationtrial.create': function(workerId, assignmentId, hitId){
        trial = SimulationTrial.findOne({workerId:workerId, assignmentId:assignmentId, hitId:hitId})
        if (trial==undefined){
            return SimulationTrial.insert({
                workerId:workerId,
                assignmentId:assignmentId,
                hitId:hitId,
                SurveyResult: {
                    gender:'',
                    age:'',
                    tasklist:{
                        'internet': {name: 'internet', 
                                    time: 0, 
                                    accomplished:0, 
                                    position: false, 
                                    energy_usage: 1, },
                        'music': {name: 'music', 
                                    time: 0, 
                                    accomplished:0, 
                                    position: false, 
                                    energy_usage: 1.5, },
                        'video': {name: 'video',
                                    time: 0,
                                    accomplished: 0,
                                    position: false,
                                    energy_usage: 2, },
                        'take/edit_photos_or_videos': { name: 'take/edit_photos_or_videos',
                                    time: 0,
                                    accomplished: 0,
                                    position: false,
                                    energy_usage: 3, },
                        'navigate_map': {name: 'navigate_map',
                                    time: 0,
                                    accomplished: 0,
                                    position: false,
                                    energy_usage: 2, },
                        'check_calendar_or_notes': {name: 'check_calendar_or_notes',
                                    time: 0,
                                    accomplished: 0,
                                    position: false,
                                    energy_usage: 1, },
                        'class_A': {name: 'class_A',
                                    time: 75,
                                    accomplished: 0,
                                    position: 'A',
                                    energy_usage: 2, },
                        'class_B': {name: 'class_B',
                                    time: 75,
                                    accomplished: 0,
                                    position: 'B',
                                    energy_usage: 2, },
                        'class_C': {name: 'class_C',
                                    time: 75,
                                    accomplished: 0,
                                    position: 'C',
                                    energy_usage: 2, },

                    }
                },
                SimulationResult: {
                    successRate:0,
                    batterySatisfaction:0,
                    chargeCount:0,
                },
                

            })
        }else{

        }

    },

    'simulationtrial.settasktime': function(workerId, assignmentId, hitId, id, value){
        var route = 'SurveyResult.tasklist.'+id+'.time'
        var update = {}
        update[route] = value
        SimulationTrial.update({workerId, assignmentId, hitId}, {$set:update})
    },

    'simulationtrial.setgenderorage': function(workerId, assignmentId, hitId, id, value){
        var route = 'SurveyResult.'+id
        var update = {}
        console.log(value)
        update[route] = value
        SimulationTrial.update({workerId, assignmentId, hitId}, {$set:update})
    },

    'simulationtrial.updatechargecount': function(workerId, assignmentId, hitId, chargeCount){
        SimulationTrial.update({workerId, assignmentId, hitId}, {$set: {'SimulationResult.chargeCount':chargeCount}})
    },

    'simulationtrial.updatetaskresult': function(workerId, assignmentId, hitId, energy_task_result){
        console.log(energy_task_result)
        var update={}
        var total_time_sum = 0
        var total_accomplished_sum = 0
        for(var i in energy_task_result){
            var id = energy_task_result[i]['name']
            total_time_sum += energy_task_result[i]['time']
            total_accomplished_sum += energy_task_result[i]['accomplished']
            var route = 'SurveyResult.tasklist.'+id
            update[route] = energy_task_result[i]
        }
        SimulationTrial.update({workerId, assignmentId, hitId}, {$set: update})
        SimulationTrial.update({workerId, assignmentId, hitId}, {$set: {'SimulationResult.successRate':total_accomplished_sum/total_time_sum}})
    },

    'maps.updatewall': function(wallpos){
        map = Maps.findOne({'name':'main'})
        if (map==undefined){
            return Maps.insert({
                name:'main',
                walls:[wallpos],
                charger:[],
                taskzone:[],
            })
        }else{
            return Maps.update({name:'main'}, { $push : { walls: wallpos}})
        }
    },
    'maps.deletewall': function(wallpos){
        
        return Maps.update({name:'main'}, { $pull : { walls: wallpos}})
    
    },

    'maps.updatetaskzone':function(pos, cn){
        map = Maps.findOne({'name':'main'})
        if (map==undefined){
            return Maps.insert({
                name:'main',
                walls:[],
                charger:[],
                taskzone:[pos],
            })
        }else{
            console.log('update!')
            return Maps.update({name:'main'}, { $push : { taskzone: {pos:pos, classname:cn}}})
        }
    },
    'maps.deletetaskzone': function(pos){
        
        return Maps.update({name:'main'}, { $pull : { taskzone: {pos:pos}}})
    
    },
    'maps.updatecharger':function(pos){
        map = Maps.findOne({'name':'main'})
        if (map==undefined){
            return Maps.insert({
                name:'main',
                walls:[],
                charger:[pos],
                taskzone:[],
            })
        }else{
            console.log('update!')
            return Maps.update({name:'main'}, { $push : { charger: pos}})
        }
    },
    'maps.deletecharger': function(pos){
        
        return Maps.update({name:'main'}, { $pull : { charger: pos}})
    
    },

    'getArm': function(workerId, assignmentId, hitId){
        var trial = SimulationTrial.findOne({workerId:workerId, assignmentId:assignmentId, hitId:hitId})
        var data = {}
        data['params']= {'surveyresult':JSON.stringify(trial.SurveyResult)}
        if (Meteor.isServer) {
            this.unblock();
            var returned= HTTP.call("POST", "http://127.0.0.1:5000/getarm", data);
            return 10+3*(returned.data-1)
          }
    }
})

export const Maps = new Mongo.Collection('maps');
export const SimulationTrial = new Mongo.Collection('simulationtrial');