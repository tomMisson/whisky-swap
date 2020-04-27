import React, { Component } from 'react'

export default class details extends Component {

    state ={
        details:[],
        id: window.location.href.split('/')[4]
    }

    componentDidMount(){
        this.getDetails();
    }

    async withdrawTrade(){
        const requestOptions = {
            crossDomain:true,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin':true},
            body: JSON.stringify(
                {
                    _id: window.location.href.split('/')[4]
                }
            )
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]), requestOptions);
            console.log(response.status)
            alert("Successfully withdrew offer")
            window.location.replace(process.env.REACT_APP_APP_URL.concat("/"))
        }
        catch(err)
        {
            alert("Unable to withdraw trade" +err)
        }
    }

    async editTrade(){
        window.location.replace(process.env.REACT_APP_APP_URL.concat("/edit/offer/"))
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
                    : null
                }   
                <h1>{this.state.details.name} {this.state.details.abv !== undefined ? <> - {this.state.details.abv}%</> : null}</h1>
                <h2>{this.state.details.distillery}</h2>
                <p>{this.state.details.details}</p>

                {
                    this.state.details.UID === sessionStorage.getItem("UID") ?
                    <>
                        <button onClick={this.withdrawTrade}>Withdraw trade</button>
                        <button onClick={this.editTrade}>Edit trade</button>
                    </>
                    :null
                }
            </main>
        )
    }
}
