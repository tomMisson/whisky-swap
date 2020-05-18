import React, { Component } from 'react'
import axios from 'axios'
import Loader from '../../Components/Loader';
import cookie from 'react-cookies'

export default class addOffer extends Component {

    constructor(params){
        super(params)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormFields = this.handleFormFields.bind(this);
    }

    state = {
        UID: cookie.load("UID"),
        uploadProgress:0
    }


    handleBack(){
        if(window.confirm("Are you sure you want to leave? Any unsaved offers will be lost."))
        {
            window.location.replace(process.env.REACT_APP_APP_URL.concat("/your-drams"))
        }
        else{}
    }

    handleSubmit = async (event) => {
        this.setState({waiting: true})
        event.preventDefault();

        if(this.state.type !== "Scotch Whisky")
            delete this.state.region

        let fd = new FormData();
        var data = this.state
        let file = this.state.file
        fd.append('image', file)
        
        delete data.file
        delete data.uploadProgress
        data = JSON.stringify(data)
        fd.append('data', data)
        

  
        axios.post(process.env.REACT_APP_API_URL.concat("/offers"), fd,
        {
            onUploadProgress: progressEvent => {
                this.setState({uploadProgress: Math.round((progressEvent.loaded/progressEvent.total) *100)})
            }
        })
            .then(res => {
                if(res.status ===200)
                {
                    alert("Added new offer")
                    window.location.replace(process.env.REACT_APP_APP_URL.concat("/your-drams"))
                    this.setState({waiting: false})
                }

            })
            .catch(err => alert("Unexpercted error: "+err))
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
                this.setState({uploadProgress:0})
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

    render() {
        return (
            <main>
                <h2>What have you got to offer?</h2>
                {
                    !this.state.waiting?
                    <div>
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
                                <option defaultValue=""></option>
                                <option value="25 ml">25ml</option>
                                <option value="50 ml">50ml</option>
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
                                <input type="text" name="region" id="region" onChange= {this.handleFormFields} />
                                <br/>
                            </label>
                            : null 
                        }
                        <label htmlFor="details">
                            Other details: 
                            <textarea name="details" id="details" value={this.state.details} onChange={this.handleFormFields}/>
                        </label>
                        <br/>
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
                            <input type="file" accept="image/*" name="image" id="image" onChange= {this.handleFormFields} />
                        </label>
                        <br/>
                        <progress id="uploadProgress" min="0" max="100" value={this.state.uploadProgress}>{this.state.uploadProgress}%</progress>
                        <br/>
                        <button type="submit" id="Add">Add</button>
                    </form>
                    <button onClick={this.handleBack}>Back</button>
                    </div>
                    :
                    <Loader/>
                }
            </main>
        )
    }
}
