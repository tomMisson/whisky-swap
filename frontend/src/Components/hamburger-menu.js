import React, { Component } from 'react'
import './hamburger-menu.css'
import $ from 'jquery'

export default class Hamburger extends Component {

    change() {
        $(".container").toggleClass("change")
        $("nav").toggleClass("visible")
    }
    
    render() {
        return (
            <div className="container" onClick={this.change}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>
        )
    }
}
