import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class addOffer extends Component {

    constructor(params){
        super(params)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormFields = this.handleFormFields.bind(this);
    }

    state = {
        UID: sessionStorage.getItem("UID")
    }

    async handleSubmit(event){
        event.preventDefault();

        const requestOptions = {
            crossDomain:true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
            body: JSON.stringify(this.state)
        };
        try{
            var response = await fetch(process.env.REACT_APP_API_URL.concat("/offers"), requestOptions);
            if(response.status===200)
            {
                alert("New offer added!");
                window.location.replace(process.env.REACT_APP_APP_URL)
            }
        }
        catch(err){ 
            alert("Something went wrong" + err)
        }
    }

    reset(){
        this.setState({region:""})
    }

    handleFormFields(event){
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
            default:
        }
    }

    render() {
        return (
            <main>
                <h2>What have you got to offer?</h2>

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
                            <input type="text" name="region" id="region" onChange= {this.handleFormFields} />
                            <br/>
                        </label>
                        : this.reset
                    }
                    <label htmlFor="details">
                        Other details: 
                        <textarea name="details" id="details" value={this.state.details} onChange={this.handleFormFields}/>
                    </label>
                    <br/>
                    <label htmlFor="image">
                        Image: 
                        <input type="file" accept="image/*" name="image" id="image" onChange= {this.handleFormFields} />
                    </label>
                    <br/>
                    <button type="submit" id="Add">Add</button>
                </form>
                <Link to="/" >Back</Link>
            </main>
        )
    }
}
