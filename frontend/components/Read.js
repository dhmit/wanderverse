import React, {useState} from "react";
import * as PropTypes from "prop-types";
import ALogo from "../images/a-wanderverse.svg";
import HideIcon from "../images/icons/hide.svg";
import CiteIcon from "../images/icons/cite.svg";
import RefreshIcon from "../images/icons/refresh.svg";
import SectionSymbols from "./SectionSymbols";

const Read = ({data}) => {
    const [citesShown, showCites] = useState(false);
    // adding line dividers until the last line of the poem
    console.log("Getting data?", data);
    const content = JSON.parse(data.verses);
    const verses = content.map((line, idx) => {
        let info = <span
            className={"text-blue"}>
            (p. {line.page_number}, {line.book_title}, {line.author})
        </span>
        return <>{idx === content.length - 1
            ? <li key={idx} className={"verse"}>{line.text}
                {citesShown && info}</li>
            : <li key={idx} className={"verse"}>
                {line.text} {citesShown && info} <span className={"text-blue"}>/</span>
            </li>
        }
        </>;
    });


    const refreshPage = () => {
        window.location.reload(false);
    }

    const toggleCitations = () => {
        showCites(!citesShown);
    }

    return (
        <div id="read" className={"text-center pt-4 pl-4 pr-4 pb-2"}>
            <a href={"/"}>
                <ALogo width={"80%"} className={"w mb-3"} fill={"#9E88FA"}/>
            </a>
            <div>
                <a onClick={refreshPage} className={"btn btn-refresh"}>
                    <RefreshIcon fill={"#9E88FA"} width={"14px"}/>
                </a>
            </div>
            <div className="wanderverse-container text-left">
                {citesShown && <HideIcon className={"pointer"} onClick={toggleCitations}/>}
                {!citesShown &&
                <CiteIcon className={"pointer"} style={{width: "20px"}} onClick={toggleCitations}/>}

                <ul className="list">
                    {verses}
                </ul>
            </div>
            <br/>
            <SectionSymbols className={"mt-4"}/>
        </div>
    );
};

Read.propTypes = {
    data: PropTypes.array
};

export default Read;
