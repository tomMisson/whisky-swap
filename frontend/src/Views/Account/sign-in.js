import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import hash from 'hash.js'

export default class profile extends Component {

    state={
        loggedIn: sessionStorage.getItem("loggedIn"),
    }

    handleForm = (event) => {
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
            case "url":
                this.setState({url: event.target.value});
                break;
            default:
        }
    }

    responseFacebook = (response) => {
        console.log(response);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            crossDomain:true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin':true},
            body: JSON.stringify(
                {
                    "email": this.state.email,
                    "pswd": hash.sha256().update(this.state.pswd).digest('hex'),
                }
            )
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/login"), requestOptions)
            response = await response.json();
            sessionStorage.setItem("UID", response.UID);
            sessionStorage.setItem("loggedIn", true);

            window.location.reload()
        }
        catch(err)
        {
            alert("Incorrect email or password")
        }
    }

    render() {
        if(!this.state.loggedIn)
        {
            return (
                <main>
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="email">
                            Email:
                            <input required type="text" id="email" value={this.state.email} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="pswd">
                            Password:
                            <input required type="password" id="pswd" value={this.state.password} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <div className="fb-login-button" data-size="medium" data-button-type="login_with" data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="true" data-width=""></div><br/>
                    <Link to="/sign-up">Don't have an account?</Link><br/>
                    <Link to="/forgot">Forgotten something?</Link>
                </main>
            )
        }
        else{
            window.location.replace(process.env.REACT_APP_APP_URL+"/account")
        }
    }
}
