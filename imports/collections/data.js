import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    // TODO data structure that stores model info with user info

        // TODO data structure should include the thread of user evaluation data


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
})

export const Maps = new Mongo.Collection('maps');