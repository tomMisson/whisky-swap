import React, { Component } from 'react'

export default class offer extends Component {

    render() {
        return (
            <div>
                <span><h3>{this.props.name}</h3> - <em>{this.props.dist}</em> </span>
                <p>{this.props.desc}</p>
            </div>
        )
    }
}
