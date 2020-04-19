import React, { Component } from 'react'
import Offer from './offer'

export default class avalibleTrades extends Component {

    constructor(props)
    {
        super(props)
        //this.setState({offers:props.offers})
    }

    state = {
        offers : []
    }

    async componentWillMount()
    {
        await fetch("http://localhost:3001/offers")
            .then(res => res.json())
            .then(res => this.setState({offers: res}))
            .then(console.log(this.state))
            .catch(err => alert("Error getting trades" + err))
    }

    render() {
        return (
            <div>
                {
                    this.state.offers.map((offer) => (
                        <Offer key={offer._id} name={offer.name} desc={offer.desc}/>
                    ))
                }
            </div>
        )
    }
}
