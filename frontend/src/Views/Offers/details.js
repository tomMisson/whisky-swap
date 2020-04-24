import React, { Component } from 'react'

export default class details extends Component {

    state ={
        details:[]
    }

    componentDidMount(){
        this.getDetails();
    }

    async getDetails(){
        var details = await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]))
        details = await details.json()
        this.setState({details: details})
        this.render()
    }

    render() {
        return(
            <main>
                {
                    this.state.details.image !== undefined ?  
                    <img src={this.state.details.image} alt="offered drink"/> 
                    : <></>
                }   
                <h1>{this.state.details.name} - {this.state.details.abv}%</h1>
                <h2>{this.state.details.distillery}</h2>
                <p>{this.state.details.details}</p>
            </main>
        )
    }
}
