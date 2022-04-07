import React, {useEffect, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import Logo from "../images/logo.svg";
import Squiggle from "../images/icons/squiggle.svg";
import axios from "axios";


const ReadDisplay = ({data}) => {
    // adding line dividers until the last line of the poem
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [wanderverses, setWanderverses] = useState([]);
    const [wanderverseElements, setWanderverseElements] = useState([]);
    const [newWanderverses, setNewWanderverses] = useState([]);

    // setWanderverses(JSON.parse(data.verses));

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

    const constructWanderverseList = () => {
        let newWans;
        if (wanderverses.length < 20) {
            console.log("wanderverses length < 20==========", wanderverses);
            newWans = [...wanderverses, ...newWanderverses];
        } else {
            console.log("wanderverses length >>>> 20==========");
            newWans = [...wanderverses.slice(10, wanderverses.length - 10), ...newWanderverses];
        }
        console.log("constructWanderverseList newWans", newWans);
        setWanderverses(newWans);
        constructWanderverseElements();
        return newWans
    }

    const constructWanderverseElements = () => {
        let wL = wanderverses.map(line => {
            let info = getInfo(line, line.id);
            return <>
                <li className={"verse-container"} key={`verse-container-${line.id}`}>
                <span key={`verse-${line.id}`} className={"verse"}>
                        {line.text} {info} <span className={"text-citation"}>/</span>
                </span>
                </li>
            </>;
        });
        console.log("!!!!constructWanderverseElements", wL);
        setWanderverseElements(wL);
    }

    // const fix

    const getWanderverses = () => {
        axios.get("/random").then((res) => {
            return JSON.parse(res.data.verses);
        }).then((v) => {
            return setNewWanderverses(v);
        });
    }

    useEffect(() => {
        console.log("data!!!", data);
        console.log("setWanderverses called on load", wanderverses);
        setInterval(getWanderverses, 6000);
    }, []);

    useEffect(() => {
        newWanderverses && newWanderverses.length && constructWanderverseList();

    }, [newWanderverses]);

    useEffect(() => {

    }, []);

    return (
        <div id="display" className={"pt-4 pl-4 pr-4 pb-2"}>
            <div className={"left-side"}>
                <div className={"logo-container"}>
                    <Logo className={"w ml-3 mb-5"} fill="#0C00FF"/>
                    <p>
                        <a href={"/"}>wanderverse.dhlab.mit.edu</a>
                        <br/>
                        <Squiggle width="190px" fill="#0C00FF"/>
                    </p>
                </div>
            </div>
            <div className="right-side">
                <div ref={containerRef} className="wanderverse-container text-left">
                    <div className="new-verse marquee">
                        <ul className="list">
                            <li className="verse-container">
                                <span className="verse">
                                    <span className="text-citation">/</span>
                                </span>
                            </li>
                            {wanderverseElements}
                            <div ref={messagesEndRef}/>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReadDisplay.propTypes = {
    data: PropTypes.object
};

export default ReadDisplay;
