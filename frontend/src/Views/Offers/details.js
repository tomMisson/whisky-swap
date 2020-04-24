import React, { Component } from 'react'

export default class details extends Component {

    componentDidMount(){
        console.log(window.location.href)
        this.getDetails();
    }

    async getDetails(){
        console.log(window.location.href)
        await fetch(process.env.REACT_APP_API_URL.concat("/offers/"))
            .then(res => res.json())
            .then(res => this.setState({offers: res}))
            .catch(err => alert("Error getting trades" + err))
    } 


    render() {
        return (
            <main>
                <h1>Details</h1>
            </main>
        )
    }
}
