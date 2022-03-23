import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import {getCookie} from "../common";
import Symbol from "./Symbol";
import CircleIcon from "../images/icons/circle.svg";
import CheckIcon from "../images/icons/plus-circle.svg";
import RefreshIcon from "../images/icons/refresh.svg";
import DownArrow from "../images/icons/down-arrow.svg";

const cookie = getCookie("csrftoken");

const rulesURL = "/rules/"
const addVerseURL = "/add-verse/"
const Play = ({data}) => {
    const [rules, setRules] = useState([]);
    const [verse, setVerse] = useState([]);

    // form values
    const [newVerse, setNewVerse] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookPageNumber, setBookPageNumber] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookGenre, setBookGenre] = useState("");
    const [startNew, setStartNew] = useState(true);
    const [instructionStyle, setInstructionStyle] = useState({});
    const [playStyle, setPlayStyle] = useState({});
    const [instructionsClass, setDismissInstructionsClass] = useState("");
    const [instructionsText, setInstructionsText] = useState("CONTINUE");

    const instructionsRef = useRef(null);

    const dismissModal = () => {
        if (window.innerWidth >= 768) return;
        let val = instructionsClass === "dismissed" ? "" : "dismissed";
        setDismissInstructionsClass(val);
        // if dismissed is called, remove instructions
        let instructionStyle = val === "dismissed" ? {height: instructionsRef.current.getBoundingClientRect().top + 23 + "px"} : {};
        setInstructionStyle(instructionStyle);
        let playStyle = val === "dismissed" ? {marginTop: instructionsRef.current.getBoundingClientRect().top + 23 + "px"} : {};
        setPlayStyle(playStyle);
        setTimeout(() => {
            let text = instructionsClass === "dismissed" ? "CONTINUE" : "";
            setInstructionsText(text);
        }, 200);
    }

    useEffect(() => {
        /* If rules already exist, use those */
        // TODO: add check if rules were completed
        if (localStorage.getItem("rules")) {
            setRules(JSON.parse(localStorage.getItem("rules")))
        } else {
            axios.get(rulesURL).then((res) => {
                setRules(res.data.rules);
                localStorage.setItem("rules", JSON.stringify(res.data.rules));
            })
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("verse") && localStorage.getItem("wanderverseID")) {
            setVerse(JSON.parse(localStorage.getItem("verse")))
        } else {
            localStorage.setItem("verse", JSON.stringify(data.exquisite_verse));
            setVerse(data.exquisite_verse);
            localStorage.setItem("wanderverseID", data.id.toString())
        }
    }, []);

    const triggerStartNew = () => {
        console.log("triggerStartNew", !startNew)
        setStartNew(!startNew);
    }

    const refresh = () => {
        clearLocalStorage();
        axios.get("/wanderverses").then(res => {
            setVerse(res.data.w);
            localStorage.setItem("verse", JSON.stringify(res.data.w));
            let instructionStyle = instructionsClass === "dismissed" ? {height: instructionsRef.current.getBoundingClientRect().top + 23 + "px"} : {};
            setInstructionStyle(instructionStyle);
        })

    }

    const clearLocalStorage = () => {
        localStorage.removeItem("verse");
        localStorage.removeItem("wanderverseID");
        localStorage.removeItem("rules");
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        let id = localStorage.getItem("wanderverseID")
        let params = {
            id: id,
            verse: newVerse,
            book_title: bookTitle,
            author: bookAuthor,
            genre: bookGenre,
            last_verse: verse,
            start_new: startNew,
        }
        console.log("params", params);
        if (bookPageNumber) {
            params.page_number = bookPageNumber
        }

        axios.post(addVerseURL,
            params, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": cookie
                }
            }).then(() => {
            clearLocalStorage();
            window.location.assign("/read/?id=" + id);
        }).catch((error) => {
            console.log("catching", error);
        })
    }

    return (
        <>
            <div style={instructionStyle}
                 className={`instructions-overlay text-center pl-4 pr-4 pb-2 ${instructionsClass}`}>
                <h1 className={"page-title mt-3 mb-3"}>CONTINUE THE POEM</h1>
                <a className={"btn btn-default btn-refresh"} onClick={refresh}>
                    <RefreshIcon className={"icon-refresh"} height={"16px"}
                                 fill={"#0C00FF"}/>
                </a>
                <div id={"exquisite-verse"} className={"text-left"}>
                    <div className={"box-inner"}>
                        {verse}
                    </div>
                </div>

                <div className={"rules text-left mt-2 pb-2"}>
                    <a className={"page-title instructions-title ml-1 btn-default"}
                       ref={instructionsRef} onClick={dismissModal}>
                        Instructions <DownArrow className="icon-down-arrow" width={"10px"}
                                                fill={"#0C00FFFF"}/>
                    </a>
                    <ul className="rules-list">
                        {rules.map((line, idx) => {
                            return <li key={idx} className={"rules-item"}>
                                <span className={"symbol-icon"}>
                                    <Symbol fill="#0C00FF" top={"0"} left={"20px"}
                                            height={"13"}
                                            spanTag={true}
                                            stop={true}/>
                                </span>
                                <span className={"line"}>{line}</span>
                            </li>;
                        })}
                    </ul>
                    <div className={"text-center"}>
                        <button className={"btn btn-tertiary btn-dismiss mx-auto"}
                                onClick={dismissModal}>
                            {instructionsText}
                        </button>
                    </div>
                </div>
            </div>

            <div style={playStyle} className={"w-form p-4"}>
                <form onSubmit={handleSubmit}>
                    <div className={"form-group"}>
                        <label htmlFor="verse-input" className={"text-plain"}>Your found
                            text</label>
                        <div className={"new-verse box-outer"}>
                        <textarea name={newVerse}
                                  required
                                  onChange={e => setNewVerse(e.target.value)}
                                  className={"form-control"}
                                  id={"verse-input"}/>
                        </div>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Author</label>
                        <input name={bookAuthor}
                               required
                               onChange={e => setBookAuthor(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Title</label>
                        <input name={bookTitle}
                               required
                               onChange={e => setBookTitle(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <div className={"form-group row mb-6"}>
                        <label className={"col-auto"}>Genre</label>
                        <input name={bookGenre}
                               onChange={e => setBookGenre(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Page</label>
                        <input name={bookPageNumber}
                               onChange={e => setBookPageNumber(e.target.value)}
                               className={"form-control col-2"}
                               type={"number"}/>
                    </div>
                    <span>{startNew
                        ? <CheckIcon
                            stroke={"#0C00FF"}
                            className={"btn-icon mr-2 mb-1 ml-1"}
                            onClick={triggerStartNew}
                        /> : <CircleIcon onClick={triggerStartNew}
                                         className={"btn-icon mr-2 mb-1 ml-1"}
                                         stroke={"#0C00FF"}/>}
                        </span>
                    <label className={"col-auto text-small text-plain"}>Use this verse to seed a new
                        poem, too.</label>
                    <div className={"row mt-2"}>
                        <button className={"col-auto btn btn-primary btn-submit text-center"}
                                type={"submit"}>
                            ADD VERSE
                        </button>
                    </div>
                </form>
            </div>
        </>);
};
Play.propTypes = {
    data: PropTypes.object
};

export default Play;
