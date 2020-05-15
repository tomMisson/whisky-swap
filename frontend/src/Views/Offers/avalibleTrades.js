import React, { Component } from 'react'
import Offer from './offerTile'
import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader';
import cookie from 'react-cookies'

export default class avalibleTrades extends Component {
    state = {
        offers : []
    }

    async fetchOffers(){
        this.setState({waiting:true})
        var res;
        res = this.props.filter === undefined ? res = await fetch(process.env.REACT_APP_API_URL.concat("/offers")) : res = await fetch(process.env.REACT_APP_API_URL.concat("/user-offers/"+cookie.load("UID")))
        res = await res.json()
        this.setState({offers: res})
        this.setState({waiting:false})
    } 

    componentDidMount()
    {
        this.fetchOffers()  
    }

    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.fetchOffers() 
        }
      }

    render() {
        return(
            this.state.waiting?
            <Loader/>
            :
            <>
                {this.props.filter !== undefined ? 
                <>
                    <Link to="add-offer">
                        Add a dram!
                    </Link>
                    <br/>
                    {
                        this.state.offers.length === 0 ? 
                        <p>It looks like you have <strong>no offers!</strong> <Link to="add-offer">Share a dram</Link> to be able to trade!</p>
                        :
                        this.state.offers.map((offer) => 
                            offer.UID === cookie.load("UID") ?
                            <Offer key={offer._id} img={offer.image} size={offer.size} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                            :
                            null
                        )
                    }
                </>
                :
                <>
                {cookie.load("loggedIn") === "true" ? 
                
                    this.state.offers.map((offer) => (
                        offer.UID === cookie.load("UID") ? 
                        null
                        :
                        <Offer key={offer._id} size={offer.size} img={offer.image} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>)
                    )
                    :
                    this.state.offers.map((offer) => (
                        <Offer key={offer._id} size={offer.size} img={offer.image} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>)
                    )
                }
                </>
                }

                
            </>
        )
    }
}
