import React, { Component } from 'react'

export default class offerTile extends Component {

    render() {
        return (
            <div>
                {this.props.img === undefined ? <></> : <img alt="offer" width="130" height="250" src={this.props.img}/>}
                <span><h3>{this.props.name}</h3> - <em>{this.props.dist}</em> </span>
                <span><p>{this.props.desc} {this.props.abv}</p></span>
            </div>
        )
    }
}
