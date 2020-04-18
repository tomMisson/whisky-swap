import React, { Component } from 'react'

export default class profile extends Component {

    constructor(props){
        super(props);
    
        this.state={
            loggedIn:false,
            signingUp: false,
            profileDetails:{
                name:"Tom Misson",
                email:"11tmisson@gmail.com"
            },
            email:"",
            pswd:""
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePswdChange = this.handlePswdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleEmailChange(event){
        this.setState({email: event.target.value});
    }

    handlePswdChange(event){
        this.setState({pswd: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        
    }

    handleSignUp(event){
        this.state.signingUp = this.setState({signingUp:!this.state.signingUp});
        this.forceUpdate();
    }

    render() {
        if(this.state.signingUp){
            return (
                <main>
                    <h2>Sign up</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label for="email">
                            Email:
                            <input type="text" name="email" value={this.state.email} onChange={this.handleEmailChange}/>
                        </label>
                        <br/>
                        <label for="pswd">
                            Password:
                            <input type="password" name="pswd" value={this.state.pswd} onChange={this.handlePswdChange}/>
                        </label>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <button onClick={this.handleSignUp}>Back</button>
                </main>
            )
        }
        if(!this.state.loggedIn)
        {
            return (
                <main>
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label for="email">
                            Email:
                            <input type="text" name="email" value={this.state.email} onChange={this.handleEmailChange}/>
                        </label>
                        <br/>
                        <label for="pswd">
                            Password:
                            <input type="password" name="pswd" value={this.state.pswd} onChange={this.handlePswdChange}/>
                        </label>
                        <br/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <button onClick={this.handleSignUp}>Sign Up</button>
                </main>
            )
        }
        else{
            return (
                <main>
                    <h2>Welcome back, {this.state.profileDetails.name.split(" ")[0]}</h2>
                    <p>{JSON.stringify(this.state.profileDetails)}</p>
                </main>
            )
        }
    }
}
