import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import Hamburger from '../../Components/hamburger-menu'
import './header.css'
import $ from 'jquery'

export default class header extends Component {

    hideMenu(){
        $("nav").toggleClass("visible")
        $(".container").toggleClass("change")
    }

    render() {
        return (
            <header>
                <div className="titleBar">
                {
                    cookie.load("loggedIn") !== "false" && cookie.load("loggedIn") !== undefined? 
                    <Link to="/browse"><h1>Doorstep drams</h1> </Link>
                    :
                    <Link to="/"><h1>Doorstep drams</h1> </Link>
                }   
                <Hamburger/>
                </div>
                <nav>
                    <ul>
                        {
                            cookie.load("loggedIn") !== undefined && cookie.load("loggedIn") !== "false" ? 
                            //Signed in
                            this.props.links.map((link) => 
                                link.signInNeeded ? 
                                <li key={link.id} onClick={this.hideMenu}><Link to={link.uri}>{link.text}</Link></li>
                                :
                                null
                            )
                            :
                            //Not signed in
                            this.props.links.map((link) => 
                                link.signInNeeded ? 
                                null
                                :
                                <li key={link.id} onClick={this.hideMenu}><Link to={link.uri}>{link.text}</Link></li>
                            )
                        }
                    </ul>
                </nav>
            </header>
        )
    }
}
