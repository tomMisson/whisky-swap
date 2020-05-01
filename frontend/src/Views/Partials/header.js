import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class header extends Component {
    render() {
        return (
            <header>
                {
                    sessionStorage.getItem("loggedIn") ? 
                    <Link to="/browse"><h1>Doorstep drams</h1> </Link>
                    :
                    <Link to="/"><h1>Doorstep drams</h1> </Link>
                }   
                <nav>
                    <ul>
                        {
                            sessionStorage.getItem("loggedIn") ? 
                            this.props.links.map((link) => 
                                link.signInNeeded ? 
                                <li key={link.id}><Link to={link.uri}>{link.text}</Link></li>
                                :
                                null
                            )
                            :
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
