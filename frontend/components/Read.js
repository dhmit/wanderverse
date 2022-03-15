import React, {useState} from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";
import HideIcon from "../images/icons/hide.svg";
import CiteIcon from "../images/icons/cite.svg";
import SectionSymbols from "./SectionSymbols";
import FancyButton from "./FancyButton";

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

    const toggleCitations = () => {
        showCites(!citesShown);
    }

    return (
        <div id="read" className={"text-center pt-4 pl-4 pr-4 pb-2"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"} fill={"#9E88FA"}/></a>
            <h3 className={"page-title col-auto"}>A Wanderverse</h3>
            <div className="wanderverse-container text-left">
                {citesShown && <HideIcon onClick={toggleCitations}/>}
                {!citesShown && <CiteIcon style={{width: "20px"}} onClick={toggleCitations}/>}

                <ul className="list">
                    {verses}
                </ul>
            </div>
            {/*<SectionSymbols/>*/}
            <button className={"btn btn-secondary"} href={"/read"}>Read Another</button>
        </div>
    );
};

Read.propTypes = {
    data: PropTypes.array
};

export default Read;
