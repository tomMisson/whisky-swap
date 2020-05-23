import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader';
import cookie from 'react-cookies'
import axios from 'axios'
import './details.css'

export default class details extends Component {

    state ={
        editMode: false,
    }

    componentDidMount(){
        this.setState({waiting:true})
        this.getDetails();
    }

    withdrawTrade = async() =>{
        
        if (window.confirm("Are you sure you want to withdraw your trade?") === true) { 
            this.setState({waiting:true})
            const requestOptions = {
                crossDomain:true,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin':true},
                body: JSON.stringify(
                    {
                        _id: window.location.href.split('/')[4]
                    }
                )
            };
            try{
                var response = await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]), requestOptions);
                if(response.status === 200)
                {
                    this.setState({waiting:false})
                    alert("Successfully withdrew offer")
                    window.location.replace(process.env.REACT_APP_APP_URL.concat("/your-drams"))
                }
                else{
                    this.setState({waiting:false})
                    alert("Something went wrong, please try again")
                }
            }
            catch(err)
            {
                this.setState({waiting:false})
                alert("Unable to withdraw trade" +err)
            }
        } 
        else { } 
    }

    async proposeTrade(){
        var res = await fetch(process.env.REACT_APP_API_URL.concat("/user-offers/"+cookie.load("UID")))
        res = await res.json();
        if(res.length === 0)
        {
            alert("You aren't currently sharing any drams so you can't propose a trade. Add a dram to start trading with others")
        }
        else{
            alert("Placeholder for trade trigger")
        }
    }

    async getDetails(){
        const requestOptions = {
            crossDomain:true,
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin':true}
        };
        const api_URL= process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4])
        var details = await fetch(api_URL, requestOptions)
        details = await details.json()
        details = details[0]
        this.setState({id: details.id})
        this.setState({name: details.name})
        this.setState({distillery: details.distillery})
        this.setState({abv: details.abv})
        this.setState({details: details.details})
        this.setState({type: details.type})
        this.setState({image: details.image})
        this.setState({bottler: details.bottler})
        this.setState({UID: details.UID})
        this.setState({region: details.region})
        this.setState({size: details.size})
        this.setState({momdetails: details.momdetails})
        this.setState({waiting:false})
        this.render()
    }

    handleSubmit = async (event) =>{
        this.setState({waiting:true})
        event.preventDefault();

        if(this.state.type !== "Scotch Whisky")
        delete this.state.region

        let fd = new FormData();
        var data = this.state
        let file = this.state.file
        delete data.file
        delete data.waiting
        delete data.editMode
        data = JSON.stringify(data)
        fd.append('data', data)
        fd.append('image', file)

        axios.put(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]), fd)
            .then(res => {
                if(res.status ===200)
                {
                    alert("Updated offer")
                    this.setState({editMode:false})
                    this.setState({waiting: false})
                    window.location.reload()
                }

            })
            .catch(err => {
                this.setState({waiting: false}) 
                alert("Unexpercted error: "+err)
            })
    }

    toggleEdit = ()=>{
        var currentval = this.state.editMode;
        if(currentval)
        {
            if(window.confirm("Are you sure you want to go back? unsaved changes will be lost."))
            {
                this.setState({editMode:!currentval})
            }
            else{}
        }
        this.setState({editMode:!currentval})
    }

    handleFormFields = (event) => {
        switch (event.target.id){
            case "name":
                this.setState({name: event.target.value});
                break;
            case "abv":
                this.setState({abv: event.target.value});
                break;
            case "distillery":
                this.setState({distillery: event.target.value});
                break;
            case "type":
                this.setState({type: event.target.value});
                break;
            case "details":
                this.setState({details: event.target.value});
                break;
            case "image":
                this.setState({file: event.target.files[0]});
                break;
            case "bottler":
                this.setState({bottler: event.target.value});
                break;
            case "region":
                this.setState({region: event.target.value});
                break;
            case "size":
                this.setState({size: event.target.value});
                break;
            case "MoMdetails":
                this.setState({momdetails: event.target.value});
                break;
            default:
        }
    }

    clickFile(e)
    {
        e.preventDefault()
        document.getElementById('image').click();
    }

    render() {
        return(
            this.state.waiting?
            <Loader/>
            :
            cookie.load("loggedIn") === "true" ?
                this.state.editMode ?
                <main id='edit'>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="distillery">
                            Distillery: 
                            <input type="text" name="distillery" id="distillery"  value={this.state.distillery} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="name">
                            Name of bottle: 
                            <input required type="text" name="name" id="name" value={this.state.name} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="bottler">
                            Bottler: 
                            <input type="text" name="bottler" id="bottler"  value={this.state.bottler} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="size">
                            Size: 
                            <select required name="size" id="size" value={this.state.size} onChange={this.handleFormFields}>
                                <option defaultValue={this.state.size}>{this.state.size}</option>
                                {
                                    this.state.size === "50ml" ? <option value="25ml">25ml</option> :<option value="50ml">50ml</option>    
                                }
                            </select>
                        </label>
                        <br/>
                        <label htmlFor="ABV">
                            ABV: 
                            <input type="number" step="0.1" name="AVB" id="abv" value={this.state.abv} onChange={this.handleFormFields}/>
                            %
                        </label>
                        <br/>
                        <label htmlFor="type">
                            Type: 
                            <select name="type" id="type" value={this.state.type} onChange={this.handleFormFields}>
                                <option defaultValue=""></option>
                                <option value="Scotch Whisky">Scotch Whisky</option>
                                <option value="Bourbon Whiskey">Bourbon Whiskey</option>
                                <option value="Irish Whiskey">Irish Whiskey</option>
                                <option value="Single Malt">Single Malt</option>
                                <option value="Blended Whisey">Blended Whiskey</option>
                                <option value="Japanese Whiskey">Japansese Whiskey</option>
                                <option value="Rye Whiskey">Rye Whiskey</option>
                                <option value="Malt Whiskey">Malt Whiskey</option>
                                <option value="Canadian Whiskey">Canadian Whiskey</option>
                                <option value="Tennessee Whiskey">Tennessee Whiskey</option>
                                <option value="Grain Whiskey">Grain Whiskey</option>
                                <option value="Blended malt Whiskey">Blended malt Whiskey</option>
                                <option value="Single pot still Whiskey">Single pot still Whiskey</option>
                            </select>
                        </label>
                        <br/>
                        {
                            this.state.type === "Scotch Whisky" ?
                            <label htmlFor="region">
                                Region: 
                                <input type="text" name="region" id="region" value={this.state.region} onChange= {this.handleFormFields} />
                                <br/>
                            </label>
                            : null 
                        }
                        <label htmlFor="details">
                            Other details: 
                            <textarea name="details" id="details" value={this.state.details} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="momDetails">
                            Masters of Malt link:
                            <input type="url" name="momDetails" id="MoMdetails" onChange= {this.handleFormFields} />
                        </label> 
                        <br/>
                        <label htmlFor="image">
                            Image: 
                            <button className="upload" onClick={this.clickFile}> <span className="material-icons">cloud_upload</span>  Upload a file</button>
                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleForm} style={{display:"none"}}/>
                        </label> 
                        <br/>

                        <button type="submit">Update</button>
                    </form>
                    {this.state.editMode ?
                    <button onClick={this.toggleEdit}>Back</button>:null
                    }
                </main>
                :
                <main id='signedIn'>
                    {
                        this.state.image === undefined ?  
                        null
                        : <img width="200" src={this.state.image} alt="offered drink"/> 
                    }   
                    <h2>{this.state.name} {this.state.abv !== undefined && this.state.abv !== 0 ? <> - {this.state.abv}%</> : null}</h2> 
                    <h3><small>{this.state.size !== undefined ? "Size: "+this.state.size: null}</small></h3>
                    <h4>{this.state.distillery !== undefined ? "Distilled by "+this.state.distillery: null} {this.state.bottler !== undefined && this.state.bottler !== null? ", bottled by "+this.state.bottler: null}</h4>
                    <p>{this.state.details !== null ? this.state.details: null }</p>
                    <p>{this.state.type !== null ? "Type: "+this.state.type: null } {this.state.type === "Scotch Whisky" ? " - " +this.state.region: null }</p>
                    {
                        this.state.UID === cookie.load("UID") ?
                        <>
                            <button onClick={this.withdrawTrade}>Withdraw trade</button>
                            <button onClick={this.toggleEdit}>Edit trade</button>
                        </>
                        :
                        <>
                            <button>View on Masters of Malt</button>
                            <button onClick={this.proposeTrade}>Propose trade</button>
                        </>
                    }
                </main>
            :
            <main id='nonSignedIn'>
                <h1> Oh no! you don't have an account!</h1>
                <br/>
                <p>To see the full details of what people have to offer and to place a trade, you have to have an account... </p>
                <br/>
                <p>You can <strong><Link to="/sign-up">sign up here</Link></strong> to see details and find out more! Alternativly, if you have an account, <strong><Link to="/sign-in">sign in</Link></strong> here or sign up with Facebook</p>
            </main>
        )
    }
}
