import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import hash from 'hash.js'
import Loader from '../../Components/Loader'
import cookie from 'react-cookies'
import $ from 'jquery'
import './sign-in.css'

export default class profile extends Component {

    state={
        loggedIn: cookie.load("loggedIn"),
        pswdVisible:false,
        icon: "visibility"
    }

    tooglePswdVisibility = () =>{
        if(this.state.pswdVisible){
            $("#pswd").prop('type', 'password')
            this.setState({icon:"visibility"})
        }
        else
        {
            $("#pswd").prop('type', 'text') 
            this.setState({icon:"visibility_off"})
        }
        
        this.setState({pswdVisible:!this.state.pswdVisible})
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

        this.setState({toggleLoad: true})
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
            cookie.save("UID", response.UID)
            cookie.save("loggedIn", true)
            window.location.replace(process.env.REACT_APP_APP_URL+"/account")
        }
        catch(err)
        {
            console.log(err)
            this.setState({toggleLoad: false})
            alert("Incorrect email or password")
        }
    }

    render() {
        return(
            cookie.load("UID") === undefined || cookie.load("loggedIn") === undefined ?
            this.state.toggleLoad?
            <Loader/>
            :        
                <main className="signIn">
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="email">
                            Email
                            <input required type="text" id="email" value={this.state.email} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="pswd">
                            Password
                            <span><input required type="password" id="pswd" value={this.state.password} onChange={this.handleForm}/>
                            <i className="material-icons" onClick={this.tooglePswdVisibility}>{this.state.icon}</i></span>
                        </label>
                        <br/>
                        <Link id="forgot" to="/forgot">Forgotten something?</Link>
                        <br/>
                        <input type="submit" value="Log in"/>
                    </form>
                    <div className="fb-login-button" data-size="large" data-button-type="login_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" data-width=""></div><br/>
                    <p id="signUp">No account? <Link to="/sign-up">Sign up</Link><br/></p>
                </main>

            :
            window.location.replace(process.env.REACT_APP_APP_URL+"/your-drams")
        )
    }
}
