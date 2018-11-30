import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Maps} from '../../../imports/collections/data'
import d3 from 'd3';

class MapMaker extends Component{
    grid_width = 48
    width_list = [...Array(48).keys()]
    grid_height = 27
    height_list = [...Array(27).keys()]
    state={
        totalwidth:0,
        totalheight:0,
        update_param:0
    }

    componentDidMount(){
        Meteor.call('maps.updatewall', [0,1])
        this.setState({'totalwidth': parseInt(d3.select('.svg-container').style('width'))})
        this.setState({'totalheight': parseInt(d3.select('.svg-container').style('height'))})
        var _this = this
        document.body.addEventListener('keydown', function(event) {
            _this.handleKeyPress(event)
        });
    }

    handleKeyPress(event){
        if(event.keyCode==9){
            this.setState({update_param: (this.state.update_param+1)%3})

        }
    }

    currentRender(){
        if(this.state.update_param==1){
            return (<div>
                updating walls...
            </div>)
        }else if (this.state.update_param==2){
            return (<div>
                updating chargers....
            </div>)
        }else{
            return (<div>
                updating classroom...
                <input type='text' ref="classN"></input>
            </div>)
        }
    }

    updategrid(w,h){
        console.log(this.props.map)
        var wallremove=false
        var taskzoneremove=false
        var chargerremove=false
        if(this.state.update_param!=2){
            
            for(var i in this.props.map.walls){
                var x = this.props.map.walls[i][0]
                var y = this.props.map.walls[i][1]
                if(x==w && y==h){
                    wallremove=true
                }
            }
            
            for(var i in this.props.map.taskzone){
                var x = this.props.map.taskzone[i][0]
                var y = this.props.map.taskzone[i][1]
                if(x==w && y==h){
                    taskzoneremove=true
                }
            }
        }else{
            for(var i in this.props.map.charger){
                var x = this.props.map.charger[i][0]
                var y = this.props.map.charger[i][1]
                if(x==w && y==h){
                    chargerremove = true
                }
            }
        }
        console.log(taskzoneremove, wallremove, this.updater)
        if(wallremove){
            Meteor.call('maps.deletewall',[w,h])
        }else if(taskzoneremove){
            Meteor.call('maps.deletetaskzone',[w,h])
        }else if(chargerremove){
            Meteor.call('maps.deletecharger', [w,h])
        }
        else if(this.state.update_param==0){
            Meteor.call('maps.updatetaskzone',[w,h], this.refs.classN.value)
        }else if(this.state.update_param==1){
            Meteor.call('maps.updatewall',[w,h])
        }else if(this.state.update_param==2){
            Meteor.call('maps.updatecharger', [w,h])
        }
        

    }

    rendergrids(){
        if(this.props.map!=undefined){
        return this.width_list.map((w,idx1) => {
            return this.height_list.map((h,idx2)=>{
                var color='gray'
                for(var i in this.props.map.walls){
                    var x = this.props.map.walls[i][0]
                    var y = this.props.map.walls[i][1]
                    if(x==w && y==h){
                        color='black'
                    }
                }
                for(var i in this.props.map.taskzone){
                    var x = this.props.map.taskzone[i].pos[0]
                    var y = this.props.map.taskzone[i].pos[1]
                    if(x==w && y==h){
                        color='#000055'
                    }
                }
                for(var i in this.props.map.charger){
                    var x = this.props.map.charger[i][0]
                    var y = this.props.map.charger[i][1]
                    if(x==w && y==h){
                        color='#ffff00'
                    }
                }
                return (
                    <rect key={w.toString()+"_"+h.toString()} x={(w)*this.state.totalwidth/this.grid_width} 
                    y={(h)*this.state.totalheight/this.grid_height}
                    width={25}
                    height={25}
                    stroke={'black'}
                    fill={color} onClick={this.updategrid.bind(this,w,h)}>

                    </rect>
                )
            })
        }

        )
    }
    }

    render(){
        console.log(this.width_list)
        console.log(this.height_list)
        return (
            <div>
                <h2>Map Making</h2>
                {this.currentRender()} Press tab to switch what you are going to update.
                <div className="gridworld">
                    <svg className="svg-container" width={100} height={50} > 
                        <g className='grids'>
                            {this.rendergrids()}
                        </g>                  
                    </svg>
                </div>
            </div>
        )
    }
}


export default createContainer((props) => {
    // 
    Meteor.subscribe('map')
    return {map: Maps.find({name:'main'}).fetch()[0]}
}, MapMaker); 