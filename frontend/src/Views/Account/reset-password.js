import React, { Component } from 'react'
import hash from 'hash.js'
import cookie from 'react-cookies'
import Loader from '../../Components/Loader'

export default class resetPassword extends Component {

    state={
        loggedIn:cookie.load("loggedIn"),
        newPassword: "",
        conf:"",
        email:""
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
            case "email":
                this.setState({email: e.target.value});
                break;
            default:
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        this.setState({waiting:true})
        if(this.props.uid !== undefined)
        {
            const requestOptions = {
                crossDomain: true,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
                body: JSON.stringify({password:hash.sha256().update(this.state.newPassword).digest('hex')})
            };
            try{
                var response = await fetch(process.env.REACT_APP_API_URL.concat("/profiles-password/"+this.props.uid), requestOptions);
                if(response.status===200)
                {
                    this.setState({waiting:false})
                    alert("Updated password")
                    window.location.replace(process.env.REACT_APP_APP_URL+"/account")
                }
                else if(response.status===304){
                    this.setState({waiting:false})
                    alert("Password wasn't changed")
                    window.location.replace(process.env.REACT_APP_APP_URL+"/account")
                }
            }
            catch(err){ 
                alert("Something went wrong: " + err)
            }       
        }

        if(!this.state.loggedIn){
            if(this.state.conf === this.state.newPassword){
                const requestOptions = {
                    crossDomain: true,
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
                    body: JSON.stringify({password:hash.sha256().update(this.state.newPassword).digest('hex')})
                };
                try{
                    response = await fetch(process.env.REACT_APP_API_URL.concat("/profiles-password/"+cookie.load("UID")), requestOptions);
                    if(response.status===200)
                    {
                        this.setState({waiting:false})
                        alert("Updated password")
                        window.location.replace(process.env.REACT_APP_APP_URL+"/account")
                    }
                }
                catch(err){ 
                    this.setState({waiting:false})
                    alert("Something went wrong: " + err)
                }
            }
            else{
                this.setState({waiting:false})
                alert("Passwords don't match, please check them and try again")
            }
        }
        else{
            await fetch(process.env.REACT_APP_API_URL+"/send-email-pswd/"+this.state.email)
                .then(res => {
                    
                    if(res.status === 200){
                        this.setState({waiting:false})
                        alert("We have sent you an email!")
                        window.location.replace(process.env.REACT_APP_APP_URL+"/")
                    }
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        return(
        
        this.state.waiting ?
        <Loader/>
        :
        this.props.uid === undefined ?
            !this.state.loggedIn ?
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
                    <input type="email" id="email" onChange={this.handleFormData}/><br/>
                    <button type="submit">Send me an email</button>
                </form>
            </main>
        :
        <main>
            <p>Enter your new password:</p>
            <form onSubmit={this.handleSubmit}>
                <input type="password" id="pswd" onChange={this.handleFormData}/><br/>
                <button type="submit">Update password</button>
            </form>
        </main>
        )
    }
}
