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
import L from "../images/icons/symbol-11.svg";
import M from "../images/icons/symbol-12.svg";
import N from "../images/icons/symbol-13.svg";
import O from "../images/icons/symbol-14.svg";
import P from "../images/icons/symbol-15.svg";
import Q from "../images/icons/symbol-divider.svg";
import DownArrow from "../images/icons/down-arrow.svg";
import {getRandomFromArray, colors} from "../common";

const Symbol = ({top, left, extraClass, fill, stop, spanTag, height}) => {
    const [newSymbol, setNewSymbol] = useState(<X style={{height: "10px"}}/>);
    const [rotation, setRotation] = useState(0);
    const symbols = [X, DownArrow, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q,
        <span className={"font-klima"} key={"symbol-&sect;"}>&sect;</span>,
        <span className={"font-klima"} key={"symbol-&para;"}>&para;</span>,
        <span className={"font-klima"} key={"symbol-&#8473;"}>&#8473;</span>,
        <span className={"font-klima"} key={"symbol-&#8523;"}>&#183;</span>,
        <span className={"font-klima"} key={"symbol-&#9733;"}>&#9733;</span>,
        <span className={"font-klima"} key={"symbol-&#9753;"}>&#9753;</span>,
        <span className={"font-klima"} key={"symbol-&#9755;"}>&#9755;</span>,
        <span className={"font-klima"} key={"symbol-&#x2020;"}>&#x2020;</span>,
        <span className={"font-klima"} key={"symbol-&#x2021;"}>&#x2021;</span>,
        <span className={"font-klima"} key={"symbol-&amp;"}>&amp;</span>,
        <span className={"font-klima"} key={"symbol-&rarr;"}>&rarr;</span>,
        <span className={"font-klima"} key={"symbol-&#8621;"}>&#8621;</span>,
        <span className={"font-klima"} key={"symbol-&hearts;"}>&hearts;</span>,
    ]
    useEffect(() => {
        let randomSymbol = getRandomFromArray(symbols);
        let randomHeight;
        if (!stop) {
            setRotation(Math.floor(Math.random() * 360));
        }
        let color = fill ? fill : getRandomFromArray(colors);
        if (randomSymbol.type === "span") {
            randomHeight = height ? height : Math.floor(Math.random() * 20 + 20);
            setNewSymbol(<div
                style={{fontSize: randomHeight + "px", color: color}}>{randomSymbol}</div>);
        } else {
            randomHeight = height ? height : Math.floor(Math.random() * 20 + 10);
            setNewSymbol(randomSymbol({
                position: "relative",
                fill: color,
                height: randomHeight + "px",
            }));
        }

    }, []);

    return (<>
            {spanTag ? <span className={extraClass} style={{
                    position: "relative",
                    top: top,
                    left: left,
                    transform: `rotate(${rotation}deg)`
                }}>{newSymbol}</span>
                : <div className={extraClass} style={{
                    position: "relative",
                    top: top,
                    left: left,
                    transform: `rotate(${rotation}deg)`
                }}>{newSymbol}</div>}
        </>
    )
}

Symbol.propTypes = {
    left: PropTypes.string,
    top: PropTypes.string,
    height: PropTypes.string,
    extraClass: PropTypes.string,
    fill: PropTypes.string,
    stop: PropTypes.bool,
    spanTag: PropTypes.bool
};

export default Symbol;
