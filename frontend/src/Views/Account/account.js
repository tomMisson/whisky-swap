import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class account extends Component {

    state= {
        user: {}
    }

    componentDidMount(){
        this.getUdetails()
    }

    async getUdetails(){
        await fetch(process.env.REACT_APP_API_URL.concat("/profiles/"+sessionStorage.getItem("UID")))
            .then(res => res.json())
            .then(res => this.setState({user:res}))
            .catch(err => alert("Encountered an unexpected error "+err))

        try{
            var name = this.state.user.name
            name = name.split(" ")[0]
            this.setState({fname:name})
            console.log(this.state)
        }
        catch(err){}
        
    }

    handleSignOut()
    {
        sessionStorage.clear()
        window.location.replace(process.env.REACT_APP_APP_URL+"/")
    }

    render() {
        return (
            sessionStorage.getItem("UID") !== undefined?
            <main>
                <h1> Hello, {this.state.fname}!</h1>
                {this.state.user.image === undefined ? null:<img style={{borderRadius: "25px"}} alt="Profile" src=""/>}
                <h2>Basic details</h2>
                <div>
                    <Link to="update-password">Change your password</Link>
                </div>
                <h2>Delivery preferences</h2>
                <button onClick={this.handleSignOut}>Not {this.state.fname}? Log out</button>
            </main>
            :
            window.location.replace("/sign-in")
        )
    }
}
