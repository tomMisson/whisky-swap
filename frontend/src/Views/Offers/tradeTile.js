import React, { Component } from 'react'

export default class tradeTile extends Component {



    render() {
        return (
            <div>
                <h3><a href={process.env.REACT_APP_APP_URL+"/offer/"+this.props.offeredDramID} title="offered dram">Offer</a> for <a href={process.env.REACT_APP_APP_URL+"/offer/"+this.props.yourDramID} title="your dram">one of yours</a></h3>
                <p>{this.props.message}</p>
            </div>
        )
    }
}
