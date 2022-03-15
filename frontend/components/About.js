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
                to explore spaces in the library they wouldn't otherwise get a chance to visit, and
                to promote stack browsing.
            </div>
        </div>;
    }
}

export default About;
