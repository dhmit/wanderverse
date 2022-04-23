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
    const listRef = useRef(null);
    const symbolsContainerRef = useRef(null);
    const [wanderverses, setWanderverses] = useState([]);
    const [wanderverseElements, setWanderverseElements] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [dissolveClass, setDissolveClass] = useState("");
    const [stopMarqueeClass, setStopMarqueeClass] = useState("");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let scrollIntervalID;

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
        if (!hasLeftTheStage()) {
            listRef.current.style["top"] =
                listRef.current.style["top"]
                    ? (Number(listRef.current.style["top"].split("px")[0]) - 1) + "px"
                    : verseOutOfSight();

        } else {
            console.log("scrollIntervalID", scrollIntervalID);
            window.clearInterval(scrollIntervalID);
            listRef.current.style["display"] = "none";
            listRef.current.style["top"] = verseOutOfSight();
            coverUp().then((r) => {
                getWanderverses().then((res) => {
                    setSymbols([]);
                    setTimeout(() => {
                        setWanderverses(res);
                        listRef.current.style["display"] = "block";
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
                height = randomInt(count / 2);
            } else if (count > 500) {
                height = randomInt(count / 2.5);
            }
            symbolEls.push(<Symbol extraClass="coverup-symbol"
                                   key={`count-${count}`} top={randomInt(windowHeight) + "px"}
                                   left={randomInt(windowWidth) + "px"}
                                   height={"" + height}
                                   delayDisplay={delay}/>);
        }

        setSymbols(symbolEls);
        // console.log("delay is now:", delay);
        // setTimeout(() => {
        // console.log("setDissolveClass hide");
        // setDissolveClass("hide");
        // console.log("setStopMarqueeClass", "stop");
        // setStopMarqueeClass("stop");
        // getWanderverses();
        // });
        return new Promise((resolve) => {
            setTimeout(resolve, delay + 2000);
        })
    }

    const hasLeftTheStage = () => {
        let bounding = endOfWanderverseRef.current.getBoundingClientRect();
        let containerBounding = containerRef.current.getBoundingClientRect();
        return containerBounding.top >= bounding.bottom;
    }

    useEffect(() => {
        console.log("first useEffect")
        setWanderverses(JSON.parse(data.verses));
    }, []);

    useEffect(() => {
        wanderverses.length && constructWanderverseElements();
        scrollIntervalID = setInterval(() => {
            scroll();
        }, 35);
    }, [wanderverses]);

    // useEffect(() => {
    //     scrollIntervalID = setInterval(() => {
    //         scroll();
    //     }, 35);
    //
    // }, [wanderverseElements]);

    return (
        <div id="display" className={"pt-4 pl-4 pr-4 pb-2"}>
            <div className={"left-side"}>
                <div className={"logo-container"}>
                    <Logo className={"w ml-3 mb-5"} fill="#0C00FF"/>
                    <br/><br/><br/><br/>
                    <QR fill="#0C00FF" height="100px"/>
                </div>
            </div>
            <div className="right-side">
                <div ref={containerRef} className="wanderverse-container text-left">
                    <div id="symbols-container" className={dissolveClass}
                         ref={symbolsContainerRef}>
                        {symbols}
                    </div>
                    <div className={`marquee ${dissolveClass} ${stopMarqueeClass}`}>
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

//
// .then((verses) => {
//             console.log("gotten verses", verses);
//             setWanderverses(verses);
//             setListClass("hide");
//             setTimeout(() => {
//                 setListClass("list");
//                 setDissolveClass("");
//                 setStopMarqueeClass("");
//                 setSymbols([]);
//                 // setTimeout(() => {
//                 // }, 300)
//             }, 1000);
//         });
