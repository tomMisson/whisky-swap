import React, { Component } from 'react'
import "./offerTile.css"
import {Link} from 'react-router-dom'

export default class offerTile extends Component {

    render() {
        return (
            <Link to={"/offer/"+this.props.id}>
                <div className="offer">
                    {this.props.img === undefined ? <></> : <img alt="offer" width="130" height="250" src={this.props.img}/>}
                    <span><h3>{this.props.name}</h3> - <em>{this.props.dist}</em> {this.props.abv}%</span>
                    <p>{this.props.desc}</p>
                </div>
            </Link>
        )
    }
}
