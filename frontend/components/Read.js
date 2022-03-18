import React, {useState} from "react";
import {colors2} from "../common";
import * as PropTypes from "prop-types";
import ALogo from "../images/logo-small.svg";
import HideIcon from "../images/icons/hide.svg";
import CiteIcon from "../images/icons/cite.svg";
import Symbol from "./Symbol";
import SectionSymbols from "./SectionSymbols";


const Read = ({data}) => {
    const [citesShown, showCites] = useState(false);
    // adding line dividers until the last line of the poem
    const content = JSON.parse(data.verses);

    const getInfo = (line) => {
        let infoText = "("
        if (line.page_number) {
            infoText += "p. " + line.page_number + ", ";
        }
        if (line.book_title) {
            infoText += line.book_title + ", ";
        }
        if (line.author) {
            infoText += line.author;
        }
        infoText += ")";
        infoText = infoText === "()" ? "" : infoText;
        return <span
            className={"text-citation"}>
            {infoText}
        </span>
    }

    const getRandomColor = () => {
        return colors2[Math.floor(Math.random() * colors2.length)];
    }

    const verses = content.map((line, idx) => {
        let info = getInfo(line)
        return <>
            <div className={"verse-container"}>
                <Symbol extraClass={"symbol-icon mt-2"} fill={"#F4782F"} spanTag={true}
                        stop={true}/>
                {idx === content.length - 1
                    ? <li key={idx} className={"verse"}>
                        {line.text}
                        &nbsp;{citesShown && info}</li>
                    : <li key={idx} className={"verse"}>
                        {line.text} {citesShown && info} <span className={"text-citation"}>/</span>
                    </li>
                }
            </div>
        </>;
    });

    const toggleCitations = () => {
        showCites(!citesShown);
    }

    return (
        <div id="read" className={"text-center pt-4 pl-4 pr-4 pb-2"}>
            <a href={"/"}>
                <ALogo width={"80%"} className={"w mb-3"} fill={"#9E88FA"}/>
            </a>
            {/*{window.location.href.indexOf("?id=") === -1 &&*/}
            {/*<div>*/}
            {/*    <a onClick={refreshPage} className={"btn btn-refresh"}>*/}
            {/*        <RefreshIcon fill={"#9E88FA"} width={"14px"}/>*/}
            {/*    </a>*/}
            {/*</div>*/}
            {/*}*/}
            <div className="wanderverse-container text-left">
                {citesShown &&
                <HideIcon className={"pointer"} fill={"#6D5BFB"} onClick={toggleCitations}/>}
                {!citesShown &&
                <CiteIcon className={"pointer"} style={{width: "20px"}}
                          onClick={toggleCitations}/>}

                <ul className="list">
                    {verses}
                </ul>
            </div>
            <br/>
            <SectionSymbols otherClass={"fixed-bottom symbols-bottom mb-4"}/>
        </div>
    );
};

Read.propTypes = {
    data: PropTypes.array
};

export default Read;
