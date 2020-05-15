import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'

export default class header extends Component {
    render() {
        return (
            <header>
                {
                    cookie.load("loggedIn") !== "false" && cookie.load("loggedIn") !== undefined? 
                    <Link to="/browse"><h1>Doorstep drams</h1> </Link>
                    :
                    <Link to="/"><h1>Doorstep drams</h1> </Link>
                }   
                <nav>
                    <ul>
                        {
                            cookie.load("loggedIn") !== undefined && cookie.load("loggedIn") !== "false" ? 
                            //Signed in
                            this.props.links.map((link) => 
                                link.signInNeeded ? 
                                <li key={link.id}><Link to={link.uri}>{link.text}</Link></li>
                                :
                                null
                            )
                            :
                            //Not signed in
                            this.props.links.map((link) => 
                                link.signInNeeded ? 
                                null
                                :
                                <li key={link.id}><Link to={link.uri}>{link.text}</Link></li>
                            )
                        }
                    </ul>
                </nav>
            </header>
        )
    }
}
