import axios from "axios";
import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";
import X from "../images/icons/x.svg";
import DownArrow from "../images/icons/down-arrow.svg";
import {getCookie} from "../common";

const cookie = getCookie("csrftoken");

const rulesURL = "/rules/"
const addVerseURL = "/add-verse/"
const Play = ({data}) => {
    const [rules, setRules] = useState([]);
    const [verse, setVerse] = useState([]);
    const [instructionsClass, setDismissInstructionsClass] = useState("");
    const [instructionsText, setInstructionsText] = useState("Exit to add a new verse");

    // form values
    const [newVerse, setNewVerse] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookPageNumber, setBookPageNumber] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookGenre, setBookGenre] = useState("");

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
        if (localStorage.getItem("verse")) {
            setVerse(JSON.parse(localStorage.getItem("verse")))
        } else {
            localStorage.setItem("verse", JSON.stringify(data.exquisite_verse));
            setVerse(data.exquisite_verse);
            localStorage.setItem("wanderverseID", data.id.toString())
        }
    }, []);
    const clearLocalStorage = () => {
        localStorage.removeItem("verse");
        localStorage.removeItem("wanderverseID");
        localStorage.removeItem("rules");
    }

    const dismissModal = () => {
        let val = instructionsClass === "dismissed" ? "" : "dismissed";
        setDismissInstructionsClass(val);
        let text = instructionsClass === "dismissed" ? "Exit to add a new verse" : "Show" +
            " instructions";
        setInstructionsText(text);
    }
    const handleSubmit = (evt) => {
        console.log("getting name?", newVerse, bookTitle, evt)
        evt.preventDefault();
        let id = localStorage.getItem("wanderverseID")
        let params = {
            id: id,
            verse: newVerse,
            title: bookTitle,
            author: bookAuthor,
            genre: bookGenre,
            page_number: bookPageNumber,
            last_verse: verse,

        }

        axios.post(addVerseURL,
            params, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": cookie
                }
            }).then((res) => {
            console.log("verse added", res.data);
            clearLocalStorage();
        })
    }

    return (
        <>
            <div className={`instructions-overlay text-center pt-4 pl-4 pr-4 pb-2 ${instructionsClass}`}>
                <a href={"/"}>
                    <W height={"80px"} fill={"black"} stroke={"black"} className={"w mb-4"}/></a>
                <h1 className={"page-title"}>Play</h1>
                <h2 className={"text-left"}>Last line of poem to extend:</h2>
                <div id={"exquisite-verse"} className={"font-calmius text-left"}>
                    {verse}
                </div>
                <div className={"rules text-left mt-4 pb-4"}>
                    <div className={"instructions-title"}>
                        <h3 className={"page-title text-left d-inline"}>Instructions
                            <div className={"d-inline-block hr"}/>
                        </h3>

                    </div>
                    <ul className="rules-list">
                        {rules.map((line, idx) => {
                            return <li key={idx}>{line}</li>;
                        })}
                    </ul>
                </div>
                <button className={"btn btn-tertiary btn-dismiss mt-3"}
                        onClick={dismissModal}>
                    {instructionsText}
                    <br/>
                    {instructionsText.indexOf("Exit") > -1 ?
                        <X width={"10px"} height={"10px"} /> :
                        <DownArrow width={"10px"} height={"10px"} />
                    }
                </button>
            </div>
            <div className={"w-form  p-4"}>
                <form className={"mt-5"} onSubmit={handleSubmit}>
                    <label htmlFor={"verse"}>
                        The last line of the poem to extend:
                    </label>
                    <p id={"verse"}>&ldquo;{verse}&rdquo;</p>
                    <label>

                    </label>
                    <div className={"form-group"}>
                        <label htmlFor="verse-input">Your found text</label>
                        <p>Add your verse to extend the poem above.</p>
                        <textarea name={newVerse}
                                  onChange={e => setNewVerse(e.target.value)}
                                  className={"form-control"}
                                  id={"verse-input"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-2 pt-2"}>Title</label>
                        <input name={bookTitle}
                               onChange={e => setBookTitle(e.target.value)}
                               className={"form-control col-10"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-5 pt-2"}>Page number</label>
                        <input name={bookPageNumber}
                               onChange={e => setBookPageNumber(e.target.value)}
                               className={"form-control col-7"}
                               type={"number"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-3 pt-2"}>Author</label>
                        <input name={bookAuthor}
                               onChange={e => setBookAuthor(e.target.value)}
                               className={"form-control col-9"}/>
                    </div>
                    <div className={"form-group row mb-6"}>
                        <label className={"col-3 pt-2"}>Genre</label>
                        <input name={bookGenre}
                               onChange={e => setBookGenre(e.target.value)}
                               className={"form-control col-9"}/>
                    </div>
                    <div className={"row"}>
                        <button className={"col-4 btn btn-primary text-center"}
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
