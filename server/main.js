import { Meteor } from 'meteor/meteor';
import { Maps } from '../imports/collections/data';
Meteor.startup(() => {
  // TODO subcribe to function that creates one's own model selection policy

  // TODO subcribe to function that gets a model from model selection policy

  // TODO subcribe to function that updates one's model selection policy

  // 

  Meteor.publish('map', function(){
    return Maps.find({});
  })
});
