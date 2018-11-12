// TODO 1 : conditional tasking
// TODO 2 : Wall
// TODO 3 : Scheduling

import React, { Component } from 'react';
import d3 from 'd3';
class Simulation extends Component{
    // battery amount
    battery = 10
    // power efficiency (battery amount) / (minute)
    power_efficiency = 10
    // idle energy usage
    idle = 1
    // task list
        // each task list is composed of name, energy_usage, position(it needs to be done), time(required for the task, seconds)
    energy_task_list = [
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
            name: 'note_taking_classA',
            energy_usage: 2,
            position: 'classA',
            time: 90,
            accomplished:0,
        },
    ]

    charging_speed = 0.5
    charging_stations=[
        [1,2],
        [10,5],
    ]
    charging = false
    //width and height of the grid world
    grid_width = 48
    grid_height = 27
    state={
        totalwidth:0,
        totalheight:0,
        agentx: 3,
        agenty: 2,

        cur_battery: 10,

        activated_task:[],
    }

    //status whether the agent is moving or not
    moving = false
    

    componentDidMount(){
        this.setState({'cur_battery': this.battery})
        this.setState({'totalwidth': parseInt(d3.select('.svg-container').style('width'))})
        this.setState({'totalheight': parseInt(d3.select('.svg-container').style('height'))})
        var _this=this
        window.setInterval(this.updateBattery.bind(this), 50)

        document.body.addEventListener('keydown', function(event) {
            _this.handleKeyPress(event)
            
        });
    }

    updateBattery(){
        // charging?
        if(this.charging){
            var next_charge = this.state.cur_battery+0.05*this.charging_speed
            if(next_charge>this.battery){
                next_charge = this.battery
            }
            this.state.cur_battery = next_charge;
//            this.setState({'cur_battery': next_charge})
        }
        if(this.state.cur_battery>0){
            console.log('heh')
            var battery_diff = this.idle // /this.power_efficiency*50/1000
            this.state.activated_task.map(idx => {
            this.energy_task_list[idx].accomplished = this.energy_task_list[idx].accomplished+0.05
            battery_diff = battery_diff + this.energy_task_list[idx].energy_usage 
        })
        this.setState({'cur_battery': this.state.cur_battery - battery_diff/this.power_efficiency*50/1000})
        }else{
            this.state.activated_task=[]
            this.setState({'cur_battery': this.state.cur_battery})
        }
        
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
                        this.state.activated_task.push(event.keyCode-49)
                    }else{
                        this.state.activated_task.splice(task_index, 1)
                    }
                }
                console.log(this.state.activated_task)
            }
        }
    }

    agent_move(event){
        this.moving = true
        setTimeout(this.agent_move_handle.bind(this, event),500)
        
    }
    agent_move_handle(event){
        if(event.keyCode==37){
            if(this.state.agentx>0)
                this.setState({'agentx':this.state.agentx-1})
        }else if(event.keyCode==38){
            if(this.state.agenty>0)
                this.setState({'agenty':this.state.agenty-1})
        }else if(event.keyCode==39){
            if(this.state.agentx<this.grid_width-1)
                this.setState({'agentx':this.state.agentx+1})
        }else if(event.keyCode==40){
            if(this.state.agenty<this.grid_height-1)
                this.setState({'agenty':this.state.agenty+1})
        }
        this.moving=false
        var docharge=false
        // check charging
        this.charging_stations.map(station=>{
            console.log(this.state.agentx, station[0], this.state.agenty, station[1])
            if(this.state.agentx==station[0] && this.state.agenty==station[1]){
                console.log('charginv')
                docharge=true
            }
        })
        this.charging=docharge

        
    }

    renderTaskList(){
        return this.energy_task_list.map((task, index) => {
            return (
                <li key={task.name}>
                    <span className={"btn "+(this.state.activated_task.indexOf(index)!=-1 ? 'activated':'deactivated')+" "+(this.state.cur_battery>0 ? '':'disabled')}>
                    {index+1} {task.name}</span>
                    <div className="progress">
                        <div className="determinate" style={{width:(this.energy_task_list[index].accomplished/this.energy_task_list[index].time*100).toString()+"%"}}></div>
                    </div>
                </li>
            )
        })
    }

    renderChargeStation(){
        return this.charging_stations.map((station,index) => {
            return (<rect key={index} x={(station[0])*this.state.totalwidth/this.grid_width} 
            y={(station[1])*this.state.totalheight/this.grid_height}
            width={24}
            height={24}
            fill={'yellow'}>

            </rect>)
        })
    }

    render() {
        return (
            <div>
                <h2>Simulation</h2>
                <div className="gridworld">
                    <div>Battery Amount</div>
                    <div className="progress">
                        
                        <div className="determinate" style={{width:(this.state.cur_battery/this.battery*100).toString()+"%"}}></div>
                    </div>
                    <div>Task List</div>
                    <ul>
                        {this.renderTaskList()}
                    </ul>
                    <svg className="svg-container" width={100} height={50} > 
                        <g className='grids'>
                            {this.renderChargeStation()}
                        </g>
                        <circle className="agent"
                        cx={(this.state.agentx+0.5)*this.state.totalwidth/this.grid_width}
                        cy={(this.state.agenty+0.5)*this.state.totalheight/this.grid_height}
                        key={`own-control`}
                        fill={'#6290db'}
                        opacity={0.5}
                        r={12}
                        />                    
                    </svg>
                </div>
            </div>
        )
    }
}

export default Simulation