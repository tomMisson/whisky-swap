import React, { Component } from 'react'
import hash from 'hash.js'
import axios from 'axios'
import Loader from '../../Components/Loader';
import cookie from 'react-cookies'

export default class profile extends Component {

    constructor(props){
        super(props);
    
        this.state={
            deliveryOption:"",
            waiting:false
        }

        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        
        if(cookie.load("loggedIn")==="true")
            this.getUdetails()
    }

    async getUdetails(){
        this.setState({waiting:true})
        var res = await fetch(process.env.REACT_APP_API_URL.concat("/profiles/"+cookie.load("UID")))
        res = await res.json()
        this.setState({name:res.name})
        this.setState({email:res.email})
        this.setState({phone:res.phone})
        this.setState({waiting:false})
    }

    handleUpdate = async (event) =>{
        this.setState({waiting:true})
        event.preventDefault()

        const requestOptions = {
            crossDomain: true,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
            body: JSON.stringify({
                name:this.state.name,
                email:this.state.email,
                phone:this.state.phone,
            })
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/profiles-details/"+cookie.load("UID")), requestOptions);
            if(response.status===200)
            {
                alert("Updated details")
                this.setState({waiting:false})
                window.location.replace(process.env.REACT_APP_APP_URL+"/account")
            }
            else if(response.status===304)
                alert("No changes made")
                this.setState({waiting:false})
                window.location.replace(process.env.REACT_APP_APP_URL+"/account")
        }
        catch(err){ 
            this.setState({waiting:false})
            alert("Something went wrong: " + err)
        }
    }

    handleForm(event){
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
            case "addrLn2":
                this.setState({line2Address: event.target.value});
                break;
            case "addrLn3":
                this.setState({line3Address: event.target.value});
                break;
            case "postcode":
                this.setState({postcode: event.target.value});
                break;
            case "deliveryOption":
                this.setState({deliveryOption: event.target.value});
                break;
            case "profPic":
                this.setState({uploadProgress:0})
                this.setState({file: event.target.files[0]});
                break;
            default:
        }
    }

    handleSubmit = async (event) => {
        this.setState({waiting:true})
        event.preventDefault();

        var fd = new FormData();
        fd.append("data", JSON.stringify(
            {
                "name":this.state.name,
                "email": this.state.email,
                "pswd": hash.sha256().update(this.state.pswd).digest('hex'),
                "phone": this.state.phone,
                "address1": this.state.line1Address,
                "address2": this.state.line2Address,
                "address3": this.state.line3Address,
                "postcode" : this.state.postcode,
                "delivery": this.state.deliveryOption
            }))
        fd.append("profPic", this.state.file)

        
        await fetch(process.env.REACT_APP_API_URL.concat("/send-email-verify/"+this.state.user.email))
            .catch(err => alert("Error sending email vericication"))
        

        axios.post(process.env.REACT_APP_API_URL.concat("/profiles"), fd,
        {
            onUploadProgress: progressEvent => {
                this.setState({uploadProgress: Math.round((progressEvent.loaded/progressEvent.total) *100)})
            }
        })
            .then(res => {
                if(res.data ===409)
                {
                    this.setState({waiting:false})
                    alert("A user with this email already exisits, if you belive this is an error, please contact support.")
                }
                else if(res.data !==409)
                {
                    this.setState({waiting:false})
                    cookie.save("UID", res.data.UID)
                    cookie.save("loggedIn", true)
                    alert("Signed up!")
                    window.location.replace(process.env.REACT_APP_APP_URL+"/account")
                }
            })
            .catch(err => alert("Unexpercted error: "+err))
    }

    render() {
        return (
            this.state.waiting?
            <Loader/>
            :
            cookie.load("loggedIn") === "false" ?
            <main>
                <h2>Sign up</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="name">
                        Full name:
                        <input required type="text" name ="name" id="name" value={this.state.name} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="email">
                        Email:
                        <input required type="text" name ="email" id="email" value={this.state.email} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="pswd">
                        Password:
                        <input required type="password" name ="pswd" id="pswd" value={this.state.pswd} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="phone">
                        Phone number:
                        <input type="tel" name="phone" id="phone" value={this.state.phone} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <p><strong>We currently only operate in the UK... Sorry</strong></p>
                    <label htmlFor="preferedDelivery">
                        Prefered delivery option:
                        <select required name="preferedDelivery" id="deliveryOption" value={this.state.deliveryOption} onChange={this.handleForm}>
                            <option defaultValue=""></option>
                            <option value="Collection">I'll collect it</option>
                            <option value="Delivery">Please bring it to me</option>
                            <option value="Post">Post it to me</option>
                        </select>
                    </label>
                    <br/>
                    {
                        this.state.deliveryOption !== "Collection" ?
                        <>
                            <label htmlFor="addrLn1">
                                House name/number:
                                <input type="text" required name="addrLn1" id="addrLn1" value={this.state.line1Address} onChange={this.handleForm}/>
                            </label>
                            <br/>
                            <label htmlFor="addrLn2">
                                Street name:
                                <input type="text" required name="addrLn2" id="addrLn2" value={this.state.line2Address} onChange={this.handleForm}/>
                            </label>
                            <br/>
                            <label htmlFor="addrLn3">
                                Post town:
                                <input type="text" required name="addrLn3" id="addrLn3" value={this.state.line3Address} onChange={this.handleForm}/>
                            </label>
                            <br/>
                            <label htmlFor="postcode">
                                Postcode:
                                <input type="text" required name="postcode" id="postcode" value={this.state.postcode} onChange={this.handleForm}/>
                            </label>
                        <br/>
                        </>
                        :null
                        
                    }
                    <label htmlFor="pic">
                        Profile picture:
                        <input type="file" accept="image/*" name="pic" id="profPic" onChange= {this.handleForm} />
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
                <a href="/sign-in">Back</a>
            </main>
            :
            this.state.waiting?
                <Loader/>
                :
                <main>
                    <form onSubmit={this.handleUpdate}>
                        <label htmlFor="name">
                            Full name:
                            <input required type="text" name ="name" id="name" value={this.state.name} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="email">
                            Email:
                            <input required type="text" name ="email" id="email" value={this.state.email} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <label htmlFor="phone">
                            Phone number:
                            <input type="tel" name="phone" id="phone" value={this.state.phone} onChange={this.handleForm}/>
                        </label>
                        <br/>
                        <input type="submit" value="Update"/>
                    </form>
                    <a href="/account">Back</a>
                </main>
        )
    }
}
