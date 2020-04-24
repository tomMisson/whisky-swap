import React, { Component } from 'react'

export default class details extends Component {

    componentDidMount(){
        this.getDetails();
    }

    async getDetails(){
        await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]))
            .then(res => res.json())
            .then(res => this.setState({details:res}))
            .catch()
    } 


    render() {
        return (
            <main>
                <h1>Details</h1>
            </main>
        )
    }
}
