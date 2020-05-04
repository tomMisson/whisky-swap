import React, { Component } from 'react'
import hash from 'hash.js'

export default class resetPassword extends Component {

    state={
        loggedIn:sessionStorage.getItem("loggedIn"),
        newPassword: "",
        conf:"",
    }

    back(){
        window.location.replace(process.env.REACT_APP_APP_URL.concat("/account"))
    }

    handleFormData = (e) => {
        switch (e.target.id){
            case "pswd":
                this.setState({newPassword: e.target.value});
                break;
            case "pswdConf":
                this.setState({conf: e.target.value});
                break;
            default:
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        if(this.state.loggedIn){
            if(this.state.conf === this.state.newPassword){
                const requestOptions = {
                    crossDomain: true,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
                    body: JSON.stringify({password:hash.sha256().update(this.state.newPassword).digest('hex')})
                };
                try{
                    var response = await fetch(process.env.REACT_APP_API_URL.concat("/profiles-password/"+sessionStorage.getItem("UID")), requestOptions);
                    if(response.status===200)
                    {
                        alert("Updated password")
                        window.location.replace(process.env.REACT_APP_APP_URL+"/account")
                    }
                }
                catch(err){ 
                    alert("Something went wrong: " + err)
                }
            }
            else{
                alert("Passwords don't match, please check them and try again")
            }
        }
        else{
            alert("Send email placeholder") //Send email
        }
    }

    render() {
        return (
            this.state.loggedIn ?
            <main>
                <p>Enter the password you would like to use:</p>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="pswd" >New password: <input id="pswd" name="pswd" type="password" value={this.state.newPassword} onChange={this.handleFormData}/></label><br/>
                    <label htmlFor="pswdConf" >Confirm password: <input id="pswdConf" name="pswdConf" type="password" value={this.state.conf} onChange={this.handleFormData}/></label>
                    <br/>
                    <button type="submit">Update</button><br/>
                </form>
                <button onClick={this.back}>Back</button>
            </main>
            :
            <main>
                <p>Please enter your email address and we will send you an email to update your password:</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" onChange={this.handleFormData}/><br/>
                    <button type="submit">Send me an email</button>
                </form>
            </main>
        )
    }
}
