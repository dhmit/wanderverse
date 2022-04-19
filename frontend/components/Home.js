import React from "react";
import FancyButton from "./FancyButton";
import Logo from "../images/logo2.svg";

const Home = () => {

    return (
        <div className={"text-center"}>
            <a href={"/"}>
                <Logo height={"10em"} className={"mb-2 mt-4"} fill={"#3D2DFD"}/>
            </a>
            <h3 className={"subtitle mb-5"}>A collaborative poetry project <br/>in MIT's Hayden Library.</h3>
            <FancyButton title={"Play"}
                         href={"instructions/"}
                         extraClass={"btn-primary"}/>
            <FancyButton title={"Read"}
                         href={"read/"}
                         extraClass={"btn-secondary"}/>
            <br/><br/>
        </div>
    );
};

export default Home;
