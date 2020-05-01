import React, { Component } from 'react'
import AvalibleTrades from '../Offers/avalibleTrades'

export default class account extends Component {

    handleSignOut()
    {
        sessionStorage.clear()
        window.location.replace(process.env.REACT_APP_APP_URL+"/")
    }

    render() {
        return (
            <main>
                <h1> NAME </h1>
                <button onClick={this.handleSignOut}>Sign out</button>
                <AvalibleTrades filter={sessionStorage.getItem("UID")}/>
            </main>
        )
    }
}
