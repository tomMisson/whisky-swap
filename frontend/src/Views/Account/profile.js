import React, { Component } from 'react'

export default class profile extends Component {

    state={
        loggedIn:false,
        profileDetails:{
            name:"Tom Misson",
            email:"11tmisson@gmail.com"
        }
    }

    render() {
        if(!this.state.loggedIn)
        {
            return (
                <main>
                    <h2>Login</h2>
                </main>
            )
        }
        else{
            return (
                <main>
                    <h2>Welcome back, {this.state.profileDetails.name.split(" ")[0]}</h2>
                </main>
            )
        }
    }
}
