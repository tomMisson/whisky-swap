import React, { Component } from 'react'
import "./offerTile.css"
import {Link} from 'react-router-dom'

export default class offerTile extends Component {

    render() {
        return (
            <div className="offer">
                {this.props.img === undefined ? null : <img alt="offer" width="120" src={this.props.img}/>}
                <span><h3>{this.props.name}</h3> - <em>{this.props.dist}</em> {this.props.abv !== undefined ? <p>{this.props.abv}%</p> : null}</span>
                <p>{this.props.desc}</p>
                <p><strong>{this.props.size}</strong></p>
            </div>
        )
    }
}
