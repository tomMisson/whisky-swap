import React, { Component } from 'react'
import hash from 'hash.js'
import cookie from 'react-cookies'
import Loader from '../../Components/Loader'
import './reset.css'
import { Link } from 'react-router-dom'

export default class resetPassword extends Component {

    state={
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
                    else
                        this.setState({waiting:false})
                        alert("Email address not found")
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        return(
        
        window.location.href.split('/')[4] !== "success" ?
        this.state.waiting ?
        <Loader/>
        :
        this.props.uid === undefined ?
            cookie.load("loggedIn") === "false" || cookie.load("loggedIn") === undefined ?
            <main>
                <h1>Forgot your password?</h1>
                <p>Please enter your email address and we will send you an email to update your password:</p>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" id="email" onChange={this.handleFormData}/><br/>
                    <button type="submit">Send me an email</button>
                </form>
            </main>
            :
            <main>
                <h1>Update your password</h1>
                <p>Enter the password you would like to use:</p>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="pswd" >New password: <input id="pswd" name="pswd" type="password" value={this.state.newPassword} onChange={this.handleFormData}/></label>
                    <label htmlFor="pswdConf" >Confirm password: <input id="pswdConf" name="pswdConf" type="password" value={this.state.conf} onChange={this.handleFormData}/></label>
                    <button type="submit" className="spanningBtn">Update</button>
                </form>
                <button onClick={this.back} className="spanningBtn">Back</button>
            </main>
        :
        <main>
            <h1>Update your password</h1>
            <p>Enter your new password:</p>
            <form onSubmit={this.handleSubmit}>
                <input type="password" id="pswd" onChange={this.handleFormData}/><br/>
                <button type="submit">Update password</button>
            </form>
        </main>
        :
        <main className='sucess'>
            <h1>Sucessfully confirmed password</h1>
            <svg fill="#fc9b14" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"  viewBox="0 0 510 510"><g><g id="check-circle-outline"><path d="M150.45,206.55l-35.7,35.7L229.5,357l255-255l-35.7-35.7L229.5,285.6L150.45,206.55z M459,255c0,112.2-91.8,204-204,204    S51,367.2,51,255S142.8,51,255,51c20.4,0,38.25,2.55,56.1,7.65l40.801-40.8C321.3,7.65,288.15,0,255,0C114.75,0,0,114.75,0,255    s114.75,255,255,255s255-114.75,255-255H459z"/></g></g></svg>
            <p>You're good to go! <Link title="Go to browsing" to="/browse">Click here to continue</Link> and see the latest offers!</p>
        </main>
        )
    }
}
