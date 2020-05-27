import React, { Component } from 'react'
import Tile from './tradeTile'

export default class trades extends Component {

    state ={
        currentOffers:[
            {id:1, offeredDramID:"5ec415906b7c8f0046ff3128", forDram:"5eab48657f9b47004c1f8593"}
        ],
        tradeHistory:[]
    }

    getActiveTrades(){

    }

    getPastTrades(){

    }

    render() {
        return (
            <main>
                {
                    this.state.currentOffers.map((trade)=>
                        <Tile offeredDramID="5ec415906b7c8f0046ff3128"  tradeDramID="5eab48657f9b47004c1f8593"/>
                    )
                }
            </main>
        )
    }
}
