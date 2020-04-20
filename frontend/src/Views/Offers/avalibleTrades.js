import React, { Component } from 'react'
import Offer from './offer'
import {Link} from 'react-router-dom'

export default class avalibleTrades extends Component {

    constructor(props)
    {
        super(props)
        this.setState({offers:props.offers})
    }

    state = {
        offers : [],
        modalVisibility: false
    }

    async fetchOffers(){
        await fetch(process.env.REACT_APP_API_URL.concat("/offers"))
            .then(res => res.json())
            .then(res => this.setState({offers: res}))
            .catch(err => alert("Error getting trades" + err))
    } 

    componentWillMount()
    {
        this.fetchOffers()
    }


    render() {
        if(this.props.filter !== undefined)
        {
            return(
                <>
                    <Link to="offer">
                        Add offer +
                    </Link>

                    <div>
                        {
                            this.state.offers.map((offer) => {
                                console.log(offer);
                                if(offer.UID === sessionStorage.getItem("UID"))
                                {
                                    return (<Offer key={offer._id} name={offer.name} dist={offer.distillery} desc={offer.details}/>)
                                }   
                                else
                                {
                                    return(<></>)
                                }
                            })
                        }
                    </div>
                </>
            )
        }
        else{
            return (
                <>
                    <div>
                        {
                            this.state.offers.map((offer) => (
                                <Offer key={offer._id} name={offer.name} dist={offer.distillery} desc={offer.details}/>
                            ))
                        }
                    </div>
                </>
            )
        }
    }
}
