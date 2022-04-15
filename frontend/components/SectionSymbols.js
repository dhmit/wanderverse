import React, {useEffect, useState} from "react";
import {shuffleArray, colors2} from "../common";
import Symbol0 from "../images/icons/symbol-0.svg";
import Symbol1 from "../images/icons/symbol-1.svg";
import Symbol2 from "../images/icons/symbol-2.svg";
import Symbol3 from "../images/icons/symbol-3.svg";
import Symbol4 from "../images/icons/symbol-4.svg";
import Symbol5 from "../images/icons/symbol-5.svg";
import Symbol6 from "../images/icons/symbol-6.svg";
import * as PropTypes from "prop-types";

let colorsDup = shuffleArray(colors2.splice(0, 5));

const SectionSymbols = ({otherClass}) => {
    const [shuffledSymbols, setShuffledSymbols] = useState([]);
    const symbols = [
        <Symbol0 key="0" fill={colorsDup[0]} height={"15px"}/>,
        <Symbol1 key="1" fill={colorsDup[1]} height={"15px"}/>,
        <Symbol2 key="2" fill={colorsDup[2]} height={"15px"}/>,
        <Symbol3 key="3" fill={colorsDup[3]} height={"15px"}/>,
        <Symbol4 key="4" fill={colorsDup[4]} height={"15px"}/>,
        <Symbol5 key="5" fill={colorsDup[5]} height={"15px"}/>,
        <Symbol6 key="6" fill={colorsDup[6]} height={"15px"}/>
    ];
    useEffect(() => {
        shuffleSymbols(symbols);
        setInterval(() => {
            shuffleSymbols();
        }, 1500);
    }, []);

    const shuffleSymbols = () => {
        let shuffled = shuffleArray(symbols);
        let newSymbols = shuffled.map((symbol, idx) => {
            return <span key={`shuffled-symbol-${idx}`}>{symbol}&nbsp;&nbsp;</span>
        });
        setShuffledSymbols(newSymbols);
    }


    return <div className={`section-symbols ${otherClass}`}>
        {shuffledSymbols}</div>
}

SectionSymbols.propTypes = {
    otherClass: PropTypes.string,
}

export default SectionSymbols;
