import React, { Component } from 'react'
import Loader from '../../Components/Loader'
import cookie from 'react-cookies'

export default class deliveryUpdate extends Component {

    state ={
        address1:"",
        address2:"",
        address3:"", 
        postcode:""
    }

    componentDidMount()
    {
        this.setState({waiting:true})
        this.getUdetails()
    }

    async getUdetails(){
        var res = await fetch(process.env.REACT_APP_API_URL.concat("/profiles/"+cookie.load("UID")))
        res = await res.json()
        this.setState({deliveryOption: res.delivery})
        this.setState({address1: res.address1})
        this.setState({address2: res.address2})
        this.setState({address3: res.address3})
        this.setState({postcode: res.postcode})
        this.setState({waiting:false})
    }

    handleForm = (event) => {
        switch (event.target.id) {
            case "address1":
                this.setState({address1: event.target.value});
                break;
            case "address2":
                this.setState({address2: event.target.value});
                break;
            case "address3":
                this.setState({address3: event.target.value});
                break;
            case "postcode":
                this.setState({postcode: event.target.value});
                break;
            case "deliveryOption":
                this.setState({deliveryOption: event.target.value});
                break;
            default:
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            crossDomain: true,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
            body: JSON.stringify({
                "address1": this.state.address1,
                "address2": this.state.address2,
                "address3": this.state.address3,
                "postcode" : this.state.postcode,
                "delivery": this.state.deliveryOption
            })    
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/profiles-delivery/"+cookie.load("UID")), requestOptions);
            console.log(response)
            if(response.status===200)
            {
                alert("Updated details")
                window.location.replace(process.env.REACT_APP_APP_URL+"/account")
            }
            else if(response.status===304)
                alert("No changes made")
                window.location.replace(process.env.REACT_APP_APP_URL+"/account")
        }
        catch(err){ 
            alert("Something went wrong: " + err)
        }    
    }

    render() {
        return (
            this.state.waiting?
            <Loader/>
            :
            <main>
                <h2>Update delivery details</h2>
                <form onSubmit={this.handleSubmit}>
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
                    
                    <label htmlFor="addrLn1">
                        House name/number:
                        <input type="text" name="addrLn1" id="address1" value={this.state.address1} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="addrLn2">
                        Street name:
                        <input type="text" name="addrLn2" id="address2" value={this.state.address2} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="addrLn3">
                        Post town:
                        <input type="text" name="addrLn3" id="address3" value={this.state.address3} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <label htmlFor="postcode">
                        Postcode:
                        <input type="text" name="postcode" id="postcode" value={this.state.postcode} onChange={this.handleForm}/>
                    </label>
                    <br/>
                    <button type="submit">Update</button>
                </form>
                <a href="/account">Back</a>
            </main>
        )
    }
}
