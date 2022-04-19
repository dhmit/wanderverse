import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import FancyButton from "./FancyButton";
import A from "../images/icons/symbol-0.svg";
import B from "../images/icons/symbol-1.svg";
import C from "../images/icons/symbol-2.svg";
import D from "../images/icons/symbol-3.svg";
import E from "../images/icons/symbol-4.svg";
import G from "../images/icons/symbol-6.svg";
import I from "../images/icons/symbol-8.svg";
import K from "../images/icons/symbol-10.svg"; // hand
import L from "../images/icons/symbol-11.svg";
import M from "../images/icons/symbol-12.svg";
import N from "../images/icons/symbol-13.svg";
import O from "../images/icons/symbol-14.svg";
import P from "../images/icons/symbol-15.svg";

import {getRandomFromArray} from "../common";

import DownArrow from "../images/icons/down-arrow.svg";

const Instructions = ({data}) => {
    const [rules, setRules] = useState(data.rules);
    const [shownRule, setShownRule] = useState("");
    const [shownRuleIdx, setShownRuleIdx] = useState(0);
    const [symbol, setSymbol] = useState(<></>);
    const symbols = [A, B, C, D, E, G, I, K, L, M, N, O, P];
    useEffect(() => {
        /* If rules already exist, use those */
        if (localStorage.getItem("rules")) {
            setRules(JSON.parse(localStorage.getItem("rules")));
        } else {
            setRules(data.rules);
            localStorage.setItem("rules", JSON.stringify(data.rules));
        }
    }, []);

    useEffect(() => {
        setShownRule(rules[0]);
        let randomSymbol = getRandomFromArray(symbols);
        setSymbol(randomSymbol);
    }, rules);

    const forward = () => {
        setShownRuleIdx(shownRuleIdx + 1);
        setShownRule(rules[shownRuleIdx + 1]);
        let randomSymbol = getRandomFromArray(symbols);
        setSymbol(randomSymbol);
    }

    const backward = () => {
        if (shownRuleIdx - 1 < 0) return;
        setShownRuleIdx(shownRuleIdx - 1);
        setShownRule(rules[shownRuleIdx - 1]);
        let randomSymbol = getRandomFromArray(symbols);
        setSymbol(randomSymbol);
    }

    return <>
        <div className={"rules text-left mt-2 pb-2"}>
            <p className="rule-position">
                <span>{shownRuleIdx + 1}</span>/{rules.length}</p>
            <div className="rules-item-container">
                <p className="rules-item">
                <span className={"symbol-icon"}>
                    {symbol}
                </span>
                    <span className={"line"}>
                    {shownRule}
                </span>
                </p>
            </div>
            <div className={"text-center"}>
                {shownRuleIdx + 1 === rules.length &&
                <FancyButton title="Ready!"
                             href={"/play/"}
                             extraClass={"btn-primary"}/>}
            </div>
        </div>
        <div className="background-area">
            {shownRuleIdx > 0 &&
            <div className="clear-area left" onClick={backward}>
                <button className="btn btn-tertiary align-middle" onClick={backward}>
                    <DownArrow className="icon-down-arrow" fill={"#0C00FFFF"}/>
                </button>
            </div>}
            {shownRuleIdx + 1 < rules.length && <div className="clear-area right" onClick={forward}>
                <button className="btn btn-tertiary align-middle ml-auto" onClick={forward}>
                    <DownArrow className="icon-down-arrow" fill={"#0C00FFFF"}/>
                </button>
            </div>}
        </div>
    </>
}


Instructions.propTypes = {
    data: PropTypes.object
};

export default Instructions;
