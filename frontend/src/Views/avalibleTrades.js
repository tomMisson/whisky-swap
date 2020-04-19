import React, { Component } from 'react'


export default class avalibleTrades extends Component {

    constructor(props)
    {
        super(props)
        this.setState({offers:props.offers})
    }

    state = {
        offers : []
    }

    async componentWillMount()
    {
        await fetch("http://localhost:3001/offers")
            .then(res => console.log(res))
            .then(res => res.json())
            .then(res => this.setState({offers: res}))
            .catch(err => alert("Error getting trades" + err))
    }

    render() {
        return (
            <div>
                <p>{JSON.stringify(this.state)}</p>
            </div>
        )
    }
}
