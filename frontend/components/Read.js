import React, {useState} from "react";
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
    const errors = JSON.parse(data.errors);
    const errorItems = errors.map((line, idx) => {
        return <li className={"alert-danger"} key={`error-${idx}`}>
            {line}
        </li>
    });

    const getInfo = (line, idx) => {
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
        return <span key={`info-${idx}`}
                     className={"text-citation"}>
            {infoText}
        </span>
    }

    const verses = content.map((line, idx) => {
        let info = getInfo(line, idx)
        return <>
            <li className={"verse-container"} key={`verse-container-${idx}`}>
                <Symbol extraClass={"symbol-icon mt-2"} fill={"#F4782F"} spanTag={true}
                        stop={true}/>
                {idx === content.length - 1
                    ? <span key={`verse-${idx}`} className={"verse"}>
                        {line.text}
                        &nbsp;{citesShown && info}</span>
                    : <span key={`verse-${idx}`} className={"verse"}>
                        {line.text} {citesShown && info} <span className={"text-citation"}>/</span>
                    </span>
                }
            </li>
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
            {errors && <ul>{errorItems}</ul>}
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
    data: PropTypes.object
};

export default Read;
