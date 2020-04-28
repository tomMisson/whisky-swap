import React, { Component } from 'react'

export default class details extends Component {

    state ={
        editMode: false,
        details:[],
        id: window.location.href.split('/')[4],
        name: "",
        type: "",
        abv: 0,
        detailsTxt: "",
        distillery: "",
    }

    componentDidMount(){
        this.getDetails();
    }

    async withdrawTrade(){
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
                window.location.replace(process.env.REACT_APP_APP_URL.concat("/"))
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

    async getDetails(){
        var details = await fetch(process.env.REACT_APP_API_URL.concat("/offers/"+window.location.href.split('/')[4]))
        details = await details.json()
        this.setState({details: details})
        this.render()
    }

    handleSubmit = async (event) =>{
        event.preventDefault();

        if(this.state.name === "")
            this.setState({name:this.state.details.name})
        else if(this.state.distillery === "")
            this.setState({distillery:this.state.details.distillery})
        else if(this.state.abv === 0)
            this.setState({abv:this.state.details.abv})
        else if(this.state.type === "")
            this.setState({type:this.state.details.type})
        else if(this.state.details === "")
            this.setState({detailsTxt:this.state.details.detailsTxt})

        const requestOptions = {
            crossDomain: true,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':true},
            body: JSON.stringify({
                name:this.state.name,
                distillery:this.state.distillery,
                type:this.state.type,
                details:this.state.details,
                abv:this.state.abv
            })
        };
        try{
            var response = await fetch("http://localhost:3001".concat("/offers/"+window.location.href.split('/')[4]), requestOptions);
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
            case "detailsTxt":
                this.setState({detailsTxt: event.target.value});
                break;
            default:
        }
    }

    render() {
        return(
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
                            <option defaultValue={this.state.details.type}></option>
                            <option value="Single Malt">Single Malt</option>
                            <option value="Blended Malt">Blended Malt</option>
                            <option value="Single Grain">Single Grain</option>
                            <option value="Blended Grain">Blended Grain</option>
                        </select>
                    </label>
                    <br/>
                    <label htmlFor="details">
                        Tasting notes / other details: 
                        <textarea name="details" id="detailsTxt" placeholder={this.state.details.details} value={this.state.detailsTxt} onChange={this.handleFormFields}/>
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
                    this.state.details.image !== undefined ?  
                    <img src={this.state.details.image} alt="offered drink"/> 
                    : null
                }   
                <h1>{this.state.details.name} {this.state.details.abv !== undefined ? <> - {this.state.details.abv}%</> : null}</h1>
                <h2>{this.state.details.distillery}</h2>
                <p>{this.state.details.details !== null ? null: this.state.details.details  }</p>

                {
                    this.state.details.UID === sessionStorage.getItem("UID") ?
                    <>
                        <button onClick={this.withdrawTrade}>Withdraw trade</button>
                        <button onClick={this.toggleEdit}>Edit trade</button>
                    </>
                    :null
                }
            </main>
        )
    }
}
