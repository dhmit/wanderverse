import React from "react";
import SectionSymbols from "./SectionSymbols";
import FancyButton from "./FancyButton";
import SymbolDivider from "../images/icons/symbol-divider.svg";
import W from "../images/icons/w.svg";

const Home = () => {

    return (
        <div className={"text-center"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <h3 className={"subtitle mb-5"}>An “exquisite corpse” poetry treasure hunt game.</h3>
            <FancyButton title={"generate instructions"}
                         href={"instructions/"}
                         extraClass={"btn-primary"}/>
            <br/><br/>
            <SymbolDivider width={"75px"}/>
            <br/><br/>
            <FancyButton title={"random wanderverse"}
                         href={"random/"}
                         extraClass={"btn-secondary"}/>
            <br/><br/>
            <SectionSymbols/>
        </div>
    );
};

export default Home;
