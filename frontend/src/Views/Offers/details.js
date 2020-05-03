import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class details extends Component {

    state ={
        editMode: false,
        details:[],
        id: window.location.href.split('/')[4],
        name: "",
        type: "",
        abv: 0,
        deets: "",
        distillery: "",
    }

    componentDidMount(){
        this.getDetails();
    }

    async withdrawTrade(){

        if (window.confirm("Are you sure you want to withdraw your trade?") == true) { 
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
                    alert("Successfully withdrew offer")
                    window.location.replace(process.env.REACT_APP_APP_URL.concat("/your-drams"))
                }
                else{
                    alert("Something went wrong, please try again")
                }
            }
            catch(err)
            {
                alert("Unable to withdraw trade" +err)
            }
        } 
        else { } 
    }

    async proposeTrade(){
        var res = await fetch(process.env.REACT_APP_API_URL.concat("/user-offers/"+sessionStorage.getItem("UID")))
        res = await res.json();
        if(res.length === 0)
        {
            alert("You aren't currently sharing any drams so you can't propose a trade. Add a dram to start trading with others")
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
        this.setState({details: details[0]})
        this.render()
    }

    agrigateData(){
        if(this.state.name === "")
            this.setState({name:this.state.details.name})
        if(this.state.distillery === "")
            this.setState({distillery:this.state.details.distillery})
        if(this.state.abv === 0)
            this.setState({abv:this.state.details.abv})
        if(this.state.type === "")
            this.setState({type:this.state.details.type})
        if(this.state.deets === "")
            this.setState({deets:this.state.details.details})
    }

    handleSubmit = async (event) =>{
        event.preventDefault();
        this.agrigateData()

        const requestOptions = {
            crossDomain: true,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
            body: JSON.stringify({
                name:this.state.name,
                distillery:this.state.distillery,
                type:this.state.type,
                details:this.state.deets,
                abv:this.state.abv
            })
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]), requestOptions);
            if(response.status===200)
            {
                alert("Updated listing")
                this.setState({editMode:false})
                window.location.reload()
            }
            else if(response.status===304){
                alert("Did not update")
                this.setState({editMode:false})
            }
        }
        catch(err){ 
            alert("Something went wrong: " + err)
        }
    }

    toggleEdit = ()=>{
        var currentval = this.state.editMode;
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
            case "deets":
                this.setState({deets: event.target.value});
                break;
            default:
        }
    }

    render() {
        return(
            sessionStorage.getItem("loggedIn") ?
                this.state.editMode ?
                <main>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">
                            Name of bottle: 
                            <input type="text" name="name" id="name" placeholder={this.state.details.name} value={this.state.name} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="distillery">
                            Distillery: 
                            <input type="text" name="distillery" id="distillery" placeholder={this.state.details.distillery} value={this.state.distillery} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <label htmlFor="ABV">
                            ABV: 
                            <input type="number" step="0.1" name="AVB" id="abv" placeholder={this.state.details.abv} value={this.state.abv} onChange={this.handleFormFields}/>
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
                        <label htmlFor="details">
                            Tasting notes / other details: 
                            <textarea name="details" id="deets" placeholder={this.state.details.details} value={this.state.deets} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
                        <button type="submit" id="Add">Update</button>
                    </form>
                    {this.state.editMode ?
                    <button onClick={this.toggleEdit}>Back</button>:null
                    }
                </main>
                :
                <main>
                    {
                        this.state.details.image === undefined ?  
                        null
                        : <img width="200" src={this.state.details.image} alt="offered drink"/> 
                    }   
                    <h1>{this.state.details.name} {this.state.details.abv !== undefined ? <> - {this.state.details.abv}%</> : null}</h1>
                    <h2>{this.state.details.distillery}</h2>
                    {
                        this.state.details.bottler !== undefined ?  
                        <h2>{this.state.details.bottler}</h2> 
                        : null
                    }   
                    <p>{this.state.details.details !== null ? this.state.details.details: null }</p>

                    {
                        this.state.details.UID === sessionStorage.getItem("UID") ?
                        <>
                            <button onClick={this.withdrawTrade}>Withdraw trade</button>
                            <button onClick={this.toggleEdit}>Edit trade</button>
                        </>
                        :
                        <>
                            <button onClick={this.proposeTrade}>Propose trade</button>
                        </>
                    }
                </main>
            :
            <main>
                <h1> Oh no! you don't have an account!</h1>
                <p>To see the full details of what people have to offer and to place a trade, you have to have an account... </p>
                <p>You can <Link to="/sign-up">sign up here</Link> to see details and find out more! Alternativly, if you have an account, <Link to="/sign-in">sign in</Link> here or sign up with Facebook</p>
            </main>
        )
    }
}
