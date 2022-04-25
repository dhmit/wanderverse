import React, {useEffect, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import Logo from "../images/logo.svg";
import QR from "../images/QR.svg";
import Symbol from "./Symbol";
import axios from "axios";


const ReadDisplay = ({data}) => {
    // adding line dividers until the last line of the poem
    const endOfWanderverseRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const progressContainerRef = useRef(null);
    const listRef = useRef(null);
    const symbolsContainerRef = useRef(null);
    const [wanderverses, setWanderverses] = useState([]);
    const [wanderverseElements, setWanderverseElements] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let scrollIntervalID;
    let originalEndPosition;
    const randomInt = (max, min = 0) => {
        return Math.floor(Math.random() * (max - min)) + min;
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

    const constructWanderverseElements = () => {
        let wL = wanderverses.map(line => {
            let info = getInfo(line, line.id);
            return <>
                <li className={"verse-container"} key={`verse-container-${line.id}`}>
                        <span key={`verse-${line.id}`} className={"verse"}>
                                {line.text} {info}
                        </span>
                </li>
            </>;
        });
        setWanderverseElements(wL);
    }

    const getWanderverses = () => {
        return axios.get("/random")
            .then((res) => {
                return JSON.parse(res.data.verses);
            });
    }

    const verseOutOfSight = () => {
        return containerRef.current.getBoundingClientRect().bottom + "px";
    }

    const scroll = () => {
        if (!endInSight()) {
            let verseBottom = endOfWanderverseRef.current.getBoundingClientRect().bottom;
            if (!originalEndPosition || originalEndPosition < verseBottom) {
                originalEndPosition = verseBottom;
            }
            listRef.current.style.top =
                listRef.current.style.top
                    ? (Number(listRef.current.style.top.split("px")[0]) - 1) + "px"
                    : verseOutOfSight();
            progressRef.current.style.height = Math.round((1 - (verseBottom / originalEndPosition)) * 100) + "px";
        } else {
            window.clearInterval(scrollIntervalID);
            listRef.current.style.display = "none";
            listRef.current.style.top = verseOutOfSight();
            coverUp().then(() => {
                getWanderverses().then((res) => {
                    setSymbols([]);
                    setTimeout(() => {
                        setWanderverses(res);
                        listRef.current.style.display = "block";
                    }, 200);
                });
            });
        }
    }

    const coverUp = () => {
        let count = 0;
        let delay = 0;
        let symbolEls = [];
        let randomNumSymbols = randomInt(300, 500);
        while (count < randomNumSymbols) {
            count += 1;
            delay = 2000 + count;
            let height = 20;
            if (count > 200 && count < 500) {
                height = randomInt(count / 1.5);
            } else if (count > 500) {
                height = randomInt(count / 2.5);
            }
            symbolEls.push(<Symbol extraClass="coverup-symbol"
                                   key={`count-${count}`} top={randomInt(windowHeight) + "px"}
                                   left={randomInt(windowWidth) + "px"}
                                   height={"" + height}
                                   delayDisplay={delay}
                                   delayHide={delay * 2 - count}
            />);
        }

        setSymbols(symbolEls);
        return new Promise((resolve) => {
            setTimeout(resolve, delay * 2 - randomNumSymbols);
        })
    }

    const endInSight = () => {
        let bounding = endOfWanderverseRef.current.getBoundingClientRect();
        let containerBounding = containerRef.current.getBoundingClientRect();
        return containerBounding.top >= bounding.bottom;
    }

    useEffect(() => {
        setWanderverses(JSON.parse(data.verses));
    }, []);

    useEffect(() => {
        wanderverses.length && constructWanderverseElements();
        originalEndPosition = undefined;
        scrollIntervalID = setInterval(() => {
            scroll();
        }, 45);
    }, [wanderverses]);

    return (
        <div id="display" className={"pt-4 pl-4 pr-4 pb-2"}>
            <div className={"left-side"}>
                <div className={"logo-container"}>
                    <Logo className={"w mt-5 mb-5"} fill="#0C00FF"/>
                    <br/><br/><br/><br/>
                    {/*<QR fill="#0C00FF" height="100px"/>*/}
                </div>
            </div>
            <div className="right-side">
                <div ref={containerRef} className="wanderverse-container text-left">
                    <div id="symbols-container" ref={symbolsContainerRef}>
                        {symbols}
                    </div>
                    <div id={"progress-container"} ref={progressContainerRef}>
                        <div id="progress-fill" ref={progressRef}/>
                    </div>
                    <div className={"marquee"}>
                        <ul ref={listRef} className={"wanderverse"}>
                            <li className="verse-container">
                                <span className="verse"/>
                            </li>
                            {wanderverseElements}
                            <div id="end" ref={endOfWanderverseRef}/>
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
