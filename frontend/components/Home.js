import React from "react";
import FancyButton from "./FancyButton";
import Logo from "../images/logo2.svg";

const Home = () => {

    return (
        <div className={"text-center"}>
            <a href={"/"}>
                <Logo height={"10em"} className={"mb-4 mt-4"} fill={"#3D2DFD"}/>
            </a>
            <h3 className={"subtitle mb-5"}>A collaborative poetry treasure hunt game.</h3>
            <FancyButton title={"Instructions"}
                         href={"play/"}
                         extraClass={"btn-primary"}/>
            <FancyButton title={"Wanderverses"}
                         href={"read/"}
                         extraClass={"btn-secondary"}/>
            <br/><br/>
        </div>
    );
};

export default Home;
