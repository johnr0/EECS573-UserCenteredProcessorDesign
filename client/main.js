import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

// instruction, tutorial, simulation, self-evaluation 
import Instruction from './components/instruction/instruction'
import SelfEvaluation from './components/self_evaluation/self_evaluation'
import Simulation from './components/simulation/simulation'
import Tutorial from './components/tutorial/tutorial'

const routes = (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path='/instruction' component={Instruction}></Route>
        <Route path='/tutorial' component={Tutorial}></Route>
        <Route path='/simulation/:workerId/:assignmentId/:hitId' component={Simulation}></Route>
        <Route path='/self_evaluation/:workerId/:assignmentId/:hitId' component={SelfEvaluation}></Route>
      </Switch>
    </div>
  </BrowserRouter>
);

//this function renders components in the class task_page
Meteor.startup(()=>{
  ReactDOM.render(routes, document.querySelector('.task_page'));
})