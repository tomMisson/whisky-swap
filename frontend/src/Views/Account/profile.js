import React, { Component } from 'react'
import AvalibleTrades from '../avalibleTrades';

export default class profile extends Component {

    constructor(props){
        super(props);
    
        this.state={
            loggedIn:sessionStorage.getItem("loggedIn"),
            signingUp: false,
            name:"",
        }

        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
    }

    handleForm(event){
        switch (event.target.id){
            case "email":
                this.setState({email: event.target.value});
                break;
            case "pswd":
                this.setState({pswd: event.target.value});
                break;
            case "phone":
                this.setState({phone: event.target.value});
                break;
            case "name":
                this.setState({name: event.target.value});
                break;
            case "addrLn1":
                this.setState({line1Address: event.target.value});
                break;
            case "postcode":
                this.setState({postcode: event.target.value});
                break;
            case "deliveryOption":
                this.setState({deliveryOption: event.target.value});
                break;
            default:
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        if(this.state.signingUp){
            const requestOptions = {
                crossDomain:true,
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        "name":this.state.name,
                        "email": this.state.email,
                        "pswd": this.state.pswd,
                        "phone": this.state.phone,
                        "address line 1": this.state.line1Address,
                        "postcode" : this.state.postcode,
                        "delivery": this.state.deliveryOption
                    }
                )
            };
            await fetch(process.env.API_URL+"/profiles", requestOptions)
                .then(res => {return res.json()})
                .then(response => sessionStorage.setItem("UID", response.UID))
                .then(sessionStorage.setItem("loggedIn", true))
                .then(alert("Signed up!"))
                .then(window.location.reload())
                .catch(err => alert("Something went wrong"))
        }
        else{
            //Sigining in 
            //if() returns one document then 
            sessionStorage.setItem("loggedIn", true);
            this.forceUpdate();
        }
    }

    toggleSignUp(event){
        var currentVal = this.state.signingUp
        this.setState({signingUp:!currentVal});
        this.forceUpdate();
    }

    render() {
        if(this.state.signingUp){
            return (
                <main>
                    <h2>Sign up</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">
                            Full name:
                            <input required type="text" name ="name" id="name" value={this.state.name} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="email">
                            Email:
                            <input required type="text" name ="email" id="email" value={this.state.email} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="pswd">
                            Password:
                            <input required type="password" name ="pswd" id="pswd" value={this.state.pswd} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="phone">
                            Telephone:
                            <input type="tel" name="phone" id="phone" value={this.state.phone} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="addrLn1">
                            Address Line 1:
                            <input required type="text" name="addrLn1" id="addrLn1" value={this.state.line1Address} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="postcode">
                            Postcode:
                            <input required type="text" name="postcode" id="postcode" value={this.state.postcode} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="preferedDelivery">
                            Prefered delivery option:
                            <select name="preferedDelivery" id="deliveryOption" value={this.state.deliveryOption} onChange={this.handleForm}>
                                <option defaultValue="Collection">Collection</option>
                                <option value="Delivery">Delivery</option>
                                <option value="Post">Post</option>
                            </select>
                        </label>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <button onClick={this.toggleSignUp}>Back</button>
                </main>
            )
        }
        if(!this.state.loggedIn)
        {
            return (
                <main>
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="email">
                            Email:
                            <input type="text" id="email" value={this.state.email} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="pswd">
                            Password:
                            <input type="password" id="pswd" value={this.state.password} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <button onClick={this.toggleSignUp}>Sign Up</button>
                </main>
            )
        }
        else{
            return (
                <main>
                    <h2>Welcome back</h2>
                    <p>{window.sessionStorage.getItem("UID")}</p>

                    <h3>Your offerings:</h3>
                    <AvalibleTrades/>
                </main>
            )
        }
    }
}
