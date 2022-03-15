import React from "react";
import FancyButton from "./FancyButton";
import W from "../images/icons/w.svg";

const Home = () => {

    return (
        <div className={"text-center"}>
            <a href={"/"}>
                <W height={"80px"} className={"2 mb-4 mt-4"} fill={"#6D5BFB"} stroke={"#6D5BFB"}/>
            </a>
            <h3 className={"subtitle mb-5"}>An “exquisite corpse” poetry treasure hunt game.</h3>
            <FancyButton title={"Play"}
                         href={"play/"}
                         extraClass={"btn-primary"}/>
            <FancyButton title={"Read"}
                         href={"read/"}
                         extraClass={"btn-secondary"}/>
            <br/><br/>
        </div>
    );
};

export default Home;
