import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class header extends Component {
    render() {
        return (
            <header>
                <h1>Doorstep drams</h1>
                <nav>
                    <ul>
                        {
                            sessionStorage.getItem("loggedIn") ? 
                            this.props.links.map((link) => 
                                <li key={link.id}><Link to={link.uri}>{link.text}</Link></li>
                            )
                            :
                            null
                        }
                    </ul>
                </nav>
            </header>
        )
    }
}
