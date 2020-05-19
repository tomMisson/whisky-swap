import React, { Component } from 'react'
import AvalibleTrades from './Offers/avalibleOffers'
import './home.css'

export default class home extends Component {
    render() {
        return (
            <main className="home">
                <h2>Welcome to Doorstep drams!</h2>
                <p>A site by whisky lovers for whisky lovers! We wanted a way to connect people (and drams!) together and share what people have in their cupboards, cabinets (if you are posh), shelves and sides to experience something different.</p>
                <br/>
                <p>Whisky is for drinking and for sharing, so why not give it a go and find your next favourite tipple. </p>
                <h2>Avalible for trading</h2>
                <AvalibleTrades/>
            </main>
        )
    }
}
