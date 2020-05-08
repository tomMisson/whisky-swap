import React, { Component } from 'react'
import CookieBanner from 'react-cookie-banner';
import "./footer.css"

export default class s extends Component {
    render() {
        return (
            <footer>
                {/* <CookieBanner
                    message="By using this site you are accepting our cookies policy"
                    link={<a href="https://github.com/tomMisson/brand/blob/master/privacy-policy.md">Learn more</a>}
                    onAccept={() => {}}
                    cookie="user-has-accepted-cookies" /> */}
                <p>Copyright &copy; Tom Misson - {new Date().getFullYear()}</p>
            </footer>
        )
    }
}
