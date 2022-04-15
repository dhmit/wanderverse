import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import ALogo from "../images/logo-small.svg";
import HideIcon from "../images/icons/hide.svg";
import CiteIcon from "../images/icons/cite.svg";
import RefreshIcon from "../images/icons/refresh.svg";
import axios from "axios";


const Read = ({data}) => {
    const [citesShown, showCites] = useState(false);
    const [wanderverse, setWanderverse] = useState([]);
    // adding line dividers until the last line of the poem
    const content = JSON.parse(data.verses);
    const errors = JSON.parse(data.errors);
    const errorItems = errors.map((line, idx) => {
        return <li className={"alert-danger"} key={`error-${idx}`}>
            {line}
        </li>
    });

    useEffect(() => {
        let verses = prepareWanderverse(content);
        setWanderverse(verses);
    }, []);

    const prepareWanderverse = (verses) => {
        return verses.map((line, idx) => {
            let info = getInfo(line, idx);
            return <>
                <li className={"verse-container"} key={`verse-container-${idx}`}>
                    {idx === content.length - 1
                        ? <span key={`verse-${idx}`} className={"verse"}>
                        {line.text}
                            &nbsp;{citesShown && info}</span>
                        : <span key={`verse-${idx}`} className={"verse"}>
                        {line.text} {citesShown && info}
                    </span>
                    }
                </li>
            </>;
        });
    }

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

    const refresh = () => {
        axios.get("/random").then(res => {
            let content = JSON.parse(res.data.verses);
            let verses = prepareWanderverse(content);
            setWanderverse(verses);
        });
    }


    const toggleCitations = () => {
        showCites(!citesShown);
    }

    return (
        <div id="read" className={"text-center pt-4 pl-4 pr-4 pb-2"}>
            <a href={"/"}>
                <ALogo style={{maxWidth: "300px"}} className={"w mb-3"} fill={"#9E88FA"}/>
            </a>
            <div className="top-info-container mb-2">
                <div className={"top-info text-left"}>
                    {errors && <ul>{errorItems}</ul>}
                    {citesShown &&
                    <HideIcon className={"left pointer"} fill={"#6D5BFB"}
                              onClick={toggleCitations}/>}
                    {!citesShown &&
                    <CiteIcon className={"left pointer"} style={{width: "20px"}}
                              onClick={toggleCitations}/>}
                </div>
                <a className={"float-right top-info refresh"} onClick={refresh}>
                    <RefreshIcon className={"icon-refresh"} height={"16px"}
                                 fill={"#0C00FF"}/>
                </a>
            </div>
            {wanderverse.length > 0 &&
            <div className="read-container mt-3">
                <div className={"inner-container"}>
                    <div className="wanderverse-container text-left">
                        <ul className="list">
                            {wanderverse}
                        </ul>
                    </div>

                </div>
            </div>}
            <br/><br/><br/>
        </div>
    );
};

Read.propTypes = {
    data: PropTypes.object
};

export default Read;
