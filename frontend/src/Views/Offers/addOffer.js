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
            var response = await fetch("http://localhost:3001/offers", requestOptions);
            if(response.status===200)
                alert("New offer added!")
        }
        catch(err){ 
            alert("Something went wrong" + err)
        }
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
                this.setState({image: event.target.files[0]});
                break;
            default:
        }
    }

    render() {
        return (
            <main>
                <h2>What have you got to offer?</h2>

                <form onSubmit={this.handleSubmit}>

                    <label htmlFor="name">
                        Name of bottle: 
                        <input required type="text" name="name" id="name" placeholder="105" value={this.state.name} onChange={this.handleFormFields}/>
                    </label>
                    <br/>
                    <label htmlFor="distillery">
                        Distillery: 
                        <input required type="text" name="distillery" id="distillery" placeholder="Glenfarclas" value={this.state.distillery} onChange={this.handleFormFields}/>
                    </label>
                    <br/>
                    <label htmlFor="ABV">
                        ABV: 
                        <input required type="number" name="AVB" id="abv" placeholder="60" value={this.state.abv} onChange={this.handleFormFields}/>
                        %
                    </label>
                    <br/>
                    <label htmlFor="type">
                        Type: 
                        <select name="type" id="type" value={this.state.type} onChange={this.handleFormFields}>
                            <option defaultValue=""></option>
                            <option value="Single Malt">Single Malt</option>
                            <option value="Blended Malt">Blended Malt</option>
                            <option value="Single Grain">Single Grain</option>
                            <option value="Blended Grain">Blended Grain</option>
                        </select>
                    </label>
                    <br/>
                    <label htmlFor="details">
                        Tasting notes / other details: 
                        <textarea name="details" id="details" placeholder="Makes a great highball" value={this.state.details} onChange={this.handleFormFields}/>
                    </label>
                    {/* <br/>
                    <label htmlFor="image">
                        Image: 
                        <input type="file" accept="image/*" name="image" onChange= {this.handleFormFields} />
                    </label> */}
                    <br/>
                    <button type="submit" id="Add">Add</button>
                </form>
                <Link to="/profile" >Cancel</Link>
            </main>
        )
    }
}
