import React, { Component } from 'react'
import Offer from './offerTile'
import {Link} from 'react-router-dom'
import Loader from '../../Components/Loader';

export default class avalibleTrades extends Component {

    state = {
        offers : [],
        filter: ""
    }

    async fetchOffers(){
        var res;
        res = this.props.filter === "" ? res = await fetch(process.env.REACT_APP_API_URL.concat("/offers")) : res = await fetch(process.env.REACT_APP_API_URL.concat("/user-offers/"+sessionStorage.getItem("UID")))
        res = await res.json()
        this.setState({offers: res})
        this.setState({waiting:false})
    } 

    componentWillMount()
    {
        this.setState({waiting:true})
        this.fetchOffers()
    }

    render() {
        return(
            this.state.waiting?
            <Loader/>
            :
            <>
                {this.props.filter !== "" ? 
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
                            offer.UID === sessionStorage.getItem("UID") ?
                            <Offer key={offer._id} img={offer.image} size={offer.size} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>
                            :
                            null
                        )
                    }
                </>
                :
                <>
                {
                this.state.offers.map((offer) => {
                        return (<Offer key={offer._id} size={offer.size} img={offer.image} name={offer.name} dist={offer.distillery} desc={offer.details} abv={offer.abv} id={offer._id}/>)
                    })
                }
                </>
                }

                
            </>
        )
    }
}
