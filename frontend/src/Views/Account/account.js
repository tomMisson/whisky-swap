import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../Components/Loader'
import cookie from 'react-cookies'

export default class account extends Component {

    state= {
        user: {},
    }

    componentDidMount(){
        this.setState({waiting:true})
        this.getUdetails()
    }

    async getUdetails(){
        this.setState({waiting:true})
        await fetch(process.env.REACT_APP_API_URL.concat("/profiles/"+cookie.load("UID")))
            .then(res => res.json())
            .then(res => this.setState({user:res}))
            .catch(err => alert("Encountered an unexpected error "+err))

        try{
            var name = this.state.user.name
            name = name.split(" ")[0]
            this.setState({fname:name})
        }
        catch(err){}
        this.setState({waiting:false})
        console.log(this.state)
    }

    sendEmail = async () => {
        await fetch(process.env.REACT_APP_API_URL.concat("/send-email-verify/"+this.state.user.email))
            .then(alert("Resent email verification"))
    }

    handleSignOut()
    {
        cookie.remove("UID")
        cookie.save("loggedIn", false)
        window.location.replace(process.env.REACT_APP_APP_URL+"/")
    }

    render() {
        return (
            cookie.load("loggedIn")?
            this.state.waiting? 
                <Loader/>
                :
                cookie.load("UID") !== undefined?
                <main>
                    {this.state.user.img !== undefined ?<img style={{borderRadius:"25px"}} alt="profilePic" width="300" src={this.state.user.img}/>:null}
                    <h1> Hello, {this.state.fname}!</h1>
                    {this.state.user.image === undefined ? null:<img style={{borderRadius: "25px"}} alt="Profile" src=""/>}
                    <h2>Basic details</h2>
                    <ul>
                        <li>Name:<p>{this.state.user.name}</p></li>
                        <li>Email address:<p>{this.state.user.email}</p>{this.state.user.verifiedEmail? null : <span><p className="warning">You need to verify your email before you can request a trade</p><button onClick={this.sendEmail}>Resend verification email</button></span>}</li>
                        <li>Phone number:<p>{this.state.user.phone}</p></li>
                    </ul>
                    <ul>
                        <li><Link to="update-details">Update details</Link></li>
                        <li><Link to="update-password">Change your password</Link></li>
                        <li><button onClick={this.handleSignOut}>Not {this.state.fname}? Log out</button></li>
                    </ul>
                    <h2>Delivery preferences</h2>
                    <ul>
                        {this.state.user.type!==undefined? <li>Prefered Delivery: this.state.user.type</li>: null}
                        {
                            this.state.user.type === "Collection" ?
                            <li>Delivery address: <p>{this.state.user.address1!==undefined || this.state.user.address1!==null? this.state.user.address1 :null}{this.state.user.address2!==undefined|| this.state.user.address2!==null? ", "+this.state.user.address2 :null}{this.state.user.address3!==undefined|| this.state.user.address3!==null? ", "+this.state.user.address3 :null} {this.state.user.postcode!==undefined || this.state.user.postcode!==null? ", "+this.state.user.postcode :null}</p></li>
                            :
                            <li><p>You have said you will collect</p></li>
                        }
                        <li><Link to="update-delivery">Update preferences</Link></li>
                    </ul>
                </main>
                :
                window.location.replace("/sign-in")
            :
            window.location.replace(process.env.REACT_APP_APP_URL+"/sign-in")
        )
    }
}
