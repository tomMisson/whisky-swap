import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class home extends Component {
    render() {
        return (
            <main>
                <h2>Welcome to Doorstep drams!</h2>
                <p>A site about sharing whisky</p>
                <p>Got a bottle you think is worth sharing? Want to try something different? <Link to="/browse">Browse offers now!</Link></p>
            </main>
        )
    }
}
