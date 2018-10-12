import React, { Component } from 'react';
import Gup from './gup'
class MturkSubmit extends Component{
    state= {
        // when it is false, the submit button is disabled
        submittable:false,
    }
    handleInputChange(event){

    }

    render() {
        return (
            // form for returning task result 
            <div >
                <form ref={ref => (this.form=ref)} method='POST' action={Gup('turkSubmitTo')!="" ? Gup('turkSubmitTo')+'/mturk/externalSubmit' : undefined }>
                    <input className='hidden' name='assignmentId' value={this.props.assignmentId} onChange={this.handleInputChange}></input>
                    <input className='hidden' name='workerId' value={this.props.workerId} onChange={this.handleInputChange}></input>
                    <input className='hidden' name='hitId' value={this.props.hitId} onChange={this.handleInputChange}></input>
                    <input type='submit' className={"btn submit-button "+(this.state.submittable ? 'show' : 'disabled')}></input>
                </form>
            </div>
        );
    }
}

export default MturkSubmit;