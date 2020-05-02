import React, { Component } from 'react'

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

        var name = this.state.user.name
        name = name.split(" ")[0]
        this.setState({fname:name})
    }

    handleSignOut()
    {
        sessionStorage.clear()
        window.location.replace(process.env.REACT_APP_APP_URL+"/")
    }

    render() {
        return (
            <main>
                <h1> Hello, {this.state.fname} !</h1>
                <button onClick={this.handleSignOut}>Not {this.state.fname}? Log out</button>
            </main>
        )
    }
}
