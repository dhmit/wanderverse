import React from "react";
import {shuffleArray, colors} from "../common";
import Symbol0 from "../images/icons/symbol-0.svg";
import Symbol1 from "../images/icons/symbol-1.svg";
import Symbol2 from "../images/icons/symbol-2.svg";
import Symbol3 from "../images/icons/symbol-3.svg";
import Symbol4 from "../images/icons/symbol-4.svg";
import Symbol5 from "../images/icons/symbol-5.svg";
import Symbol6 from "../images/icons/symbol-6.svg";

let colorsDup = shuffleArray(colors.splice(0, 5));

class SectionSymbols extends React.Component {

    render() {
        return <div className={"section-symbols"}>
            <Symbol0 fill={colorsDup[0]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol1 fill={colorsDup[1]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol2 fill={colorsDup[2]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol3 fill={colorsDup[3]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol4 fill={colorsDup[4]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol5 fill={colorsDup[1]} height={"15px"}/>&nbsp;&nbsp;
            <Symbol6 fill={colorsDup[0]} height={"15px"}/>
        </div>;
    }
}

export default SectionSymbols;
