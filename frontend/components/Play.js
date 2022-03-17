import axios from "axios";
import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import {getCookie} from "../common";
import Instructions from "./Instructions";
import CircleIcon from "../images/icons/circle.svg";
import CheckIcon from "../images/icons/plus-circle.svg";

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

    const triggerStartNew = () => {
        console.log("triggerStartNew", !startNew)
        setStartNew(!startNew);
    }

    const refreshVerse = () => {
        clearLocalStorage();
        axios.get("/wanderverses").then(res => {
            setVerse(res.data.w);
            localStorage.setItem("verse", JSON.stringify(res.data.w));
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
            <Instructions rules={rules}
                          verse={verse}
                          refresh={refreshVerse}
            />
            <div className={"w-form  p-4"}>
                <form className={"mt-5"} onSubmit={handleSubmit}>
                    <label htmlFor={"verse"}>
                        Last line of the poem to extend:
                    </label>
                    <p id={"verse"}>&ldquo;{verse}&rdquo;</p>

                    <div className={"form-group"}>
                        <label htmlFor="verse-input">Your found text</label>
                        <p>Add your verse to extend the poem above.</p>
                        <textarea name={newVerse}
                                  required
                                  onChange={e => setNewVerse(e.target.value)}
                                  className={"form-control"}
                                  id={"verse-input"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto mr-2"}>Title</label>
                        <input name={bookTitle}
                               required
                               onChange={e => setBookTitle(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto mr-2"}>Page number</label>
                        <input name={bookPageNumber}
                               onChange={e => setBookPageNumber(e.target.value)}
                               className={"form-control col"}
                               type={"number"}/>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto mr-2"}>Author</label>
                        <input name={bookAuthor}
                               required
                               onChange={e => setBookAuthor(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <div className={"form-group row mb-6"}>
                        <label className={"col-auto mr-2"}>Genre</label>
                        <input name={bookGenre}
                               onChange={e => setBookGenre(e.target.value)}
                               className={"form-control col"}/>
                    </div>
                    <span>{startNew
                        ? <CheckIcon
                            stroke={"#0C00FF"}
                            className={"btn-icon mr-2 mb-1 ml-1"}
                            onClick={triggerStartNew}
                        /> : <CircleIcon onClick={triggerStartNew}
                                         className={"btn-icon"}
                                         stroke={"#0C00FF"}/>}
                        </span>
                    <label className={"col-auto text-small"}>Use this verse to seed a new
                        poem, too.</label>
                    <div className={"row mt-4"}>
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
