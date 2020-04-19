import React, { Component } from 'react'

export default class offer extends Component {

    render() {
        return (
            <div>
                <img alt="offer"/>
                <h3>{this.props.name}</h3>
                <p>{this.props.desc}</p>
            </div>
        )
    }
}
