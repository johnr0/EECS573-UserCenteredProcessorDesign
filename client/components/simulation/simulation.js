// TODO 1 : conditional tasking
// TODO 2 : Wall
// TODO 3 : Scheduling

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Maps, SimulationTrial} from '../../../imports/collections/data'
import d3 from 'd3';
import {Link} from 'react-router-dom';
import {HTTP} from 'meteor/http';

class Simulation extends Component{
    // time out
    timeout = 8*60*60;
    cur_time = this.timeout

    acceleration_param = 96 * 0.05;
    // battery amount
    battery = 4400
    battery_state = 0; // warn when it reaches 20% 0%
    // power efficiency (battery amount) / (minute)
    power_efficiency = 7
    // idle energy usage
    idle = 1
    // task list
        // each task list is composed of name, energy_usage, position(it needs to be done), time(required for the task, seconds)
    energy_task_list = undefined/* [
        {
            name: 'music',
            energy_usage: 1.5,
            position: false,
            time: 60,
            accomplished:0,
        },
        {
            name: 'internet',
            energy_usage: 1,
            position: false,
            time: 30,
            accomplished:0,
        },
        {
            name: 'Task_A',
            energy_usage: 2,
            position: 'A',
            time: 90,
            accomplished:0,
        },
        {
            name: 'Task_B',
            energy_usage: 2,
            position: 'B',
            time: 90,
            accomplished:0,
        },
        {
            name: 'Task_C',
            energy_usage: 2,
            position: 'C',
            time: 90,
            accomplished:0,
        },
    ]*/

    charging_speed = 5000

    charging = false

    task=undefined
    //width and height of the grid world
    grid_width = 48
    grid_height = 27
    state={
        start: false,
        totalwidth:0,
        totalheight:0,
        agentx: 3,
        agenty: 2,
        end:false,
        cur_battery: 10,

        activated_task:[],
    }

    //status whether the agent is moving or not
    moving = false
    
    //usage log 
    charge_count = 0

    componentDidMount(){
        const {workerId, assignmentId, hitId} = this.props.match.params
        var _this = this
        Meteor.call('getArm', workerId, assignmentId, hitId, function(error, result){
            _this.power_efficiency = result/10
        })
        this.setState({'cur_battery': this.battery})
        this.setState({'totalwidth': parseInt(d3.select('.svg-container').style('width'))})
        this.setState({'totalheight': parseInt(d3.select('.svg-container').style('height'))})
       
    }

    updateBattery(){
        console.log(this.power_efficiency)
        this.cur_time -= 1 * this.acceleration_param;

        // charging?
        if(this.charging){
            var next_charge = this.state.cur_battery+this.charging_speed * this.acceleration_param / 60 / 60
            if(next_charge>this.battery){
                next_charge = this.battery
            }
            this.state.cur_battery = next_charge;
//            this.setState({'cur_battery': next_charge})
        }
        if(this.state.cur_battery>0){
            var battery_diff = this.idle // /this.power_efficiency*50/1000
            this.state.activated_task.map(idx => {
            this.energy_task_list[idx].accomplished = this.energy_task_list[idx].accomplished+1/this.power_efficiency/60* this.acceleration_param;
            battery_diff = battery_diff + this.energy_task_list[idx].energy_usage * this.acceleration_param/60/60;
        })
        this.setState({'cur_battery': this.state.cur_battery - battery_diff/this.power_efficiency})
            if(this.state.cur_battery/this.battery<0.2 && this.battery_state==0){
                Materialize.toast('You only have 20% of battery!', 4000)
                this.battery_state=1
            }
            if(this.state.cur_battery/this.battery>0.2 && this.battery_state!=0){
                this.battery_state =0;
            }else if(this.battery_state==2){
                this.battery_state =1;
            }

        }else{
            this.state.activated_task=[]
            this.setState({'cur_battery': this.state.cur_battery})
            if(this.battery_state==1){
                Materialize.toast('You are running out of battery!',4000)
                this.battery_state = 2;
            }
            
        }
        
        if (this.cur_time<=0 && this.state.end==false){
            console.log('end')
            this.EndTheSimulation()
        }
    }

    EndTheSimulation(){
        this.setState({end: true});
        var elClone = document.body.cloneNode(true);
        document.body.parentNode.replaceChild(elClone, document.body);
        window.clearInterval(50)
        this.SimulationResultSend()
        alert("Simulation ends now!")
    }
    
    handleKeyPress(event){
        console.log(event.keyCode)
        if([37,38,39,40].indexOf(event.keyCode)!==-1){
            if(!this.moving)
                this.agent_move(event)
            
        }else if(event.keyCode>48 && event.keyCode<58){
            if(event.keyCode-49<this.energy_task_list.length){
                //on or off
                if(this.state.cur_battery>0){
                    var task_index = this.state.activated_task.indexOf(event.keyCode-49)
                    if(task_index==-1){
                        console.log(this.task)
                        if(this.energy_task_list[event.keyCode-49].position==false){
                            return this.state.activated_task.push(event.keyCode-49)

                        }
                        //if(this.energy_task_list[event.keyCode-49].position!=false && this.energy_task_list[event.keyCode-49].position==this.task){
                        //    return this.state.activated_task.push(event.keyCode-49)
                        //}

                        
                        // when the task is related to non-playing tasks
                        /*if(this.energy_task_list[event.keyCode-49].position!=this.task){
                                if(this.energy_task_list[i].position!=this.task){
                                    this.state.activated_task.splice(i, 1)
                                }
                        }*/
                    }else{
                        if(this.energy_task_list[event.keyCode-49].position==false){
                            this.state.activated_task.splice(task_index, 1)
                    }
                        
                    }
                }
                console.log(this.state.activated_task)
            }
        }
    }

    agent_move(event){
        this.moving = true
        setTimeout(this.agent_move_handle.bind(this, event),6/60/60*this.acceleration_param)
        
    }

    wall_check(x, y){
        console.log(this.props.map)
        for(var i in this.props.map.walls){
            var xw = this.props.map.walls[i][0]
            var yw = this.props.map.walls[i][1]

            if(xw==x && yw==y){
                return false
            }
        }
        return true
    }

    agent_move_handle(event){
       if(event.keyCode==37){
            if(this.state.agentx>0 && this.wall_check(this.state.agentx-1,this.state.agenty))
                this.setState({'agentx':this.state.agentx-1})
        }else if(event.keyCode==38){
            if(this.state.agenty>0 && this.wall_check(this.state.agentx,this.state.agenty-1))
                this.setState({'agenty':this.state.agenty-1})
        }else if(event.keyCode==39){
            if(this.state.agentx<this.grid_width-1 && this.wall_check(this.state.agentx+1,this.state.agenty))
                this.setState({'agentx':this.state.agentx+1})
        }else if(event.keyCode==40){
            if(this.state.agenty<this.grid_height-1 && this.wall_check(this.state.agentx,this.state.agenty+1))
                this.setState({'agenty':this.state.agenty+1})
        }
        this.moving=false
        var docharge=false
        // check charging
        this.props.map.charger.map(station=>{
            console.log(this.state.agentx, station[0], this.state.agenty, station[1])
            if(this.state.agentx==station[0] && this.state.agenty==station[1]){
                console.log('charginv')
                docharge=true
                this.charge_count += 1
            }
        })
        this.charging=docharge

        this.task=undefined
        // check if in task area
        this.props.map.taskzone.map(tz=>{
            if(this.state.agentx==tz.pos[0] && this.state.agenty==tz.pos[1]){
                console.log(tz.classname)
                this.task = tz.classname;
            }
        })
        var topop=[]
        if(this.task!=undefined){
            //pop false task
            for(var i in this.energy_task_list){
                if(this.energy_task_list[i].position==this.task){
                    //topop.push(i)
                    //this.state.activated_task.push(i)
                    Materialize.toast('Now you are in the class!',4000)
                    this.setState({ activated_task: [...this.state.activated_task, parseInt(i)] })
                    console.log(this.state.activated_task)
                }
            }
        }else{
            //pop non-false task
            for(var i in this.state.activated_task){
                if(this.energy_task_list[this.state.activated_task[i]].position!=false){
                    topop.push(i)
                }
            }
        }
        topop.sort(function(a,b){ return a - b; })
        for (var i = topop.length -1; i >= 0; i--){
            console.log(topop[i])
            this.state.activated_task.splice(topop[i],1);
        }
        
    }

    renderTaskList(){
        if(this.props.trial!=undefined){
            if(this.energy_task_list==undefined){
                this.energy_task_list=[]
                for(var i in this.props.trial.SurveyResult.tasklist){
                    if(this.props.trial.SurveyResult.tasklist[i].time!=0){
                        this.energy_task_list.push(this.props.trial.SurveyResult.tasklist[i])
                    }
                    
                }
                this.energy_task_list
            }
            return this.energy_task_list.map((task, index) => {
                if(task.time!=0){
                return (
                    <li key={task.name}>
                        <span className={"btn "+(this.state.activated_task.indexOf(index)!=-1 ? 'activated':'deactivated')+" "+(this.state.cur_battery>0 && ((task.position!=false && this.task==task.position)||(task.position==false)) ? '':'disabled')}>
                        {index+1} {task.name}</span>
                        <span style={{"float":"right"}}>{task.time}min</span>
                        <div className="progress">
                            <div className="determinate" style={{width:(this.energy_task_list[index].accomplished/this.energy_task_list[index].time*100).toString()+"%"}}></div>
                        </div>
                    </li>
                )}1
            })
        }
    }

    renderChargeStation(){
        if(this.props.map!=undefined){
            return this.props.map.charger.map((station,index) => {
                return (<circle key={index} cx={(station[0]+0.5)*this.state.totalwidth/this.grid_width} 
                cy={(station[1]+0.5)*this.state.totalheight/this.grid_height}
                r={this.state.totalheight/this.grid_height*0.4}
                height={15}
                fill={'yellow'}>

                </circle>)
            })
        }
    }

    renderWall(){
        if(this.props.map!=undefined){
            return this.props.map.walls.map((wall, index) => {
                return (<circle key={index} cx={(wall[0]+0.5)*this.state.totalwidth/this.grid_width} 
                cy={(wall[1]+0.5)*this.state.totalheight/this.grid_height}
                r={this.state.totalheight/this.grid_height*0.5}
                fill={'black'}>

                </circle>)
            })
        }
    }

    renderTaskZone(){
        if(this.props.map!=undefined){
            return this.props.map.taskzone.map((tz, index) => {
                return (
                <g key={index}>
                    <circle cx={(tz.pos[0]+0.5)*this.state.totalwidth/this.grid_width} 
                    cy={(tz.pos[1]+0.5)*this.state.totalheight/this.grid_height}
                    r={this.state.totalheight/this.grid_height*0.5}
                    fill={'#9999ff'}>
                    </circle>
                    <text x={(tz.pos[0]+0.25)*this.state.totalwidth/this.grid_width} 
                    y={(tz.pos[1]+0.5)*this.state.totalheight/this.grid_height} fill='white'
                    fontSize={(this.state.totalheight/this.grid_height*0.6).toString()+"px"}>{tz.classname}</text>
                </g>)
            })
        }
    }

    SimulationResultSend(){
        const {workerId, assignmentId, hitId} = this.props.match.params
        console.log('hit')
        Meteor.call('simulationtrial.updatechargecount', workerId, assignmentId, hitId, this.charge_count)
        Meteor.call('simulationtrial.updatetaskresult', workerId, assignmentId, hitId, this.energy_task_list)
    }

    startSimulation(){
        var _this=this
        this.setState({'start':true});
        window.setInterval(this.updateBattery.bind(this), 50)
        
        document.body.addEventListener('keydown', function(event) {
            _this.handleKeyPress(event)
            
        });
        Materialize.toast('Now simulation started!',4000)
    }

    render() {
        return (
            <div>
                <h2 className={this.state.start ? '' : 'Invisible'}>Simulation</h2>
                <h2 className={'btn '+(this.state.start ? 'Invisible' : '')} onClick={this.startSimulation.bind(this)}>Click this button to start</h2>
                <div className="">
                    <div className='inline-blocks gridworld'>
                        <svg className="svg-container" width={70} height={35} > 
                        <g className='grids'>  
                            {this.renderWall()}
                            {this.renderTaskZone()}
                            {this.renderChargeStation()}
                        </g>
                        <circle className="agent"
                        cx={(this.state.agentx+0.5)*this.state.totalwidth/this.grid_width}
                        cy={(this.state.agenty+0.5)*this.state.totalheight/this.grid_height}
                        key={`own-control`}
                        fill={'green'}
                        r={this.state.totalheight/this.grid_height*0.3}
                        />                    
                        </svg>
                    </div>
                    <div className='inline-blocks SApanel'>
                        <div>Time of the day</div>
                        <div style={{'position':'relative'}}>
                            <div style={{'float':'left'}}>9AM</div>
                            <div style={{'position':'absolute', 'display':'inline', 'left':'35%'}}>12PM</div>
                            <div style={{'float':'right'}}>5PM</div>
                        </div>
                        <div className="progress">
                            <div className="determinate" style={{width:((this.timeout-this.cur_time)/this.timeout*100).toString()+"%"}}></div>
                        </div>
                        <div>Battery Amount</div>
                        <div className="progress">
                            <div className="determinate" style={{width:(this.state.cur_battery/this.battery*100).toString()+"%"}}></div>
                        </div>
                        <div>Task List</div>
                        <ul>
                            {this.renderTaskList()}
                        </ul>
                    </div>
                </div>
                <div className={!this.state.end ? 'Invisible': ''} style={{"textAlign":"center"}}>
                    <p>The simulation has ended :) Please proceed to the post survey!</p>
                    <Link className="btn"
                    to={"/self_evaluation/"+this.props.match.params.workerId+"/"+this.props.match.params.assignmentId+"/"+this.props.match.params.hitId+"/"+this.charge_count.toString()}>
                    Proceed</Link>
                </div>
            </div>
        )
    }
}
export default createContainer((props) => {
    const {workerId, assignmentId, hitId}=props.match.params
    Meteor.subscribe('simulationtrial')
    Meteor.subscribe('map')
    return {trial: SimulationTrial.findOne({workerId, assignmentId, hitId}), map: Maps.find({name:'main'}).fetch()[0]}
}, Simulation); 