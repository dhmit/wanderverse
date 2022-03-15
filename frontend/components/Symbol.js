import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import X from "../images/icons/x.svg";
import A from "../images/icons/symbol-0.svg";
import B from "../images/icons/symbol-1.svg";
import C from "../images/icons/symbol-2.svg";
import D from "../images/icons/symbol-3.svg";
import E from "../images/icons/symbol-4.svg";
import F from "../images/icons/symbol-5.svg";
import G from "../images/icons/symbol-6.svg";
import H from "../images/icons/symbol-7.svg";
import I from "../images/icons/symbol-8.svg";
import J from "../images/icons/symbol-9.svg";
import K from "../images/icons/symbol-10.svg";
import DownArrow from "../images/icons/down-arrow.svg";


const Symbol = ({top, left}) => {
    const [newSymbol, setNewSymbol] = useState(<X style={{height: "10px"}}/>);
    const [rotation, setRotation] = useState(0);
    const symbols = [X, DownArrow, A, B, C, D, E, F, G, H, I, J, K];
    useEffect(() => {
        let randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        let randomHeight = Math.floor(Math.random() * (20 - 10) + 10);
        setRotation(Math.floor(Math.random() * 360));
        setNewSymbol(randomSymbol({
            position: "relative",
            fill: "#0032ff",
            height: randomHeight+"px",
        }));
    }, []);
    return (
        <div style={{
            position: "relative",
            top: top,
            left: left,
            transform: `rotate(${rotation}deg)`
        }}>{newSymbol}</div>
    )
}

Symbol.propTypes = {
    left: PropTypes.string,
    top: PropTypes.string,
};

export default Symbol;