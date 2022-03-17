import React from "react";
import Logo from "../images/logo.svg";


class About extends React.Component {
    render() {
        return <div className={"about"}>
            <a href={"/"}>
                <Logo className={"2 mb-4"}/>
            </a>
            <div>The Wanderverse Project is an exquisite corpse poetry treasure hunt game. Each poem
                is called a “wanderverse.” The purpose of this project is to draw the MIT public in
                to explore spaces in Hayden Library they wouldn't otherwise get a chance to visit,
                and
                to promote stack browsing.
            </div>
            <br/>
            <div>
                The Wanderverse Project is made with generous support from CAMIT. It was created by
                Clare Stanton (<a href={"https://lil.law.harvard.edu"}>LIL</a>), Andy Silva (<a
                href={"https://lil.law.harvard.edu"}>LIL</a>), and Anastasia Aizman
                (<a href={"https://digitalhumanities.mit.edu/"}>DH</a>
                ). It was built in MIT's <a href={"https://digitalhumanities.mit.edu/"}>
                Digital Humanities Lab</a> in collaboration with Ece Turnator and Mark Szarko of MIT
                Libraries.
            </div>
        </div>
            ;
    }
}

export default About;
