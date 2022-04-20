import axios from "axios";
import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
import {getCookie} from "../common";
import CircleIcon from "../images/icons/circle.svg";
import CheckIcon from "../images/icons/plus-circle.svg";
import RefreshIcon from "../images/icons/refresh.svg";

const cookie = getCookie("csrftoken");
const addVerseURL = "/add-verse/";
const MAXINPUT = 500;

const Play = ({data}) => {
    const [verse, setVerse] = useState([]);

    // form values
    const [newVerse, setNewVerse] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [bookPageNumber, setBookPageNumber] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookGenre, setBookGenre] = useState("");
    const [startNew, setStartNew] = useState(true);
    const [formErrors, setFormErrors] = useState({
        title: "", author: "", verse: "", page: "", genre: ""
    });


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
        setStartNew(!startNew);
    }

    const refresh = () => {
        let rules = localStorage.getItem("rules");
        clearLocalStorage();
        axios.get("/wanderverses").then(res => {
            setVerse(res.data.w);
            localStorage.setItem("verse", JSON.stringify(res.data.w));
            localStorage.setItem("wanderverseID", JSON.stringify(res.data.id));
            localStorage.setItem("rules", rules);
        });
    }

    const clearLocalStorage = () => {
        localStorage.removeItem("verse");
        localStorage.removeItem("wanderverseID");
        localStorage.removeItem("rules");
    }

    const validateInputs = (key, text) => {
        let errorObj = {}
        setFormErrors(errorObj);
        if (text.length > MAXINPUT) {
            errorObj[key] =
                "Error! This text is too long. Maximum length: " + MAXINPUT + " characters."
            setFormErrors(errorObj);
            return false
        }
        return true
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();

        let valid = validateInputs("verse", newVerse) && validateInputs("author", bookAuthor) && validateInputs("genre", bookGenre) && validateInputs("title", bookTitle);

        if (!valid) return
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
            }).then((response) => {
            clearLocalStorage();
            window.location.assign("/read/?id=" + id + "&submitted=" + response.data.success);
        }).catch((error) => {
            let response = error.response.data;
            let error_obj = {};
            error_obj[response.key] = response.message;
            setFormErrors(error_obj);
        });
    }

    return (
        <>
            <div className={"w-form p-4"}>
                <label htmlFor="exquisite-verse" className={"text-plain"}>
                    Extend the Wanderverse that ends with:
                </label>
                <div id={"exquisite-verse"} className={"text-left"}>
                    &#8220;{verse}&#8221;
                </div>
                <a className={"refresh"} onClick={refresh}>
                    <RefreshIcon className={"icon-refresh"} height={"16px"}
                                 fill={"#0C00FF"}/>Request another
                </a>
                <form onSubmit={handleSubmit}>
                    <div className={"form-group"}>
                        <label htmlFor="verse-input" className="text-plain mt-3">
                            Your found text:
                        </label>
                        <div className={"new-verse box-outer mb-2"}>
                            <textarea name="newVerse"
                                      required
                                      onChange={e => setNewVerse(e.target.value)}
                                      className={"form-control"}
                                      id={"verse-input"}/>
                        </div>
                        <div className={"helper-text"}>
                            <small className="error text-danger">{formErrors["verse"]}</small>
                            <p className={"text-right required-text p-0 small text-blue mb-0"}>&#10045; required</p>
                        </div>

                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Page</label>
                        <input name="page"
                               onChange={e => setBookPageNumber(e.target.value)}
                               className={"form-control col-4"}
                               min="0"
                               max="10000"
                               type={"number"}/>
                        <div className={"helper-text"}>
                            <small className="error text-danger">{formErrors["page_number"]}</small>
                        </div>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Title</label>
                        <input name="title"
                               required
                               onChange={e => setBookTitle(e.target.value)}
                               className={"form-control col"}/>
                        <div className={"helper-text"}>
                            <small className="error text-danger">{formErrors["title"]}</small>
                            <p className={"required-text text-right p-0 small text-blue mb-0"}>&#10045; required</p>
                        </div>
                    </div>
                    <div className={"form-group row"}>
                        <label className={"col-auto"}>Author</label>
                        <input name="author"
                               required
                               onChange={e => setBookAuthor(e.target.value)}
                               className={"form-control col"}/>
                        <div className={"helper-text"}>
                            <small className="error text-danger">{formErrors["author"]}</small>
                            <p className={"required-text text-right p-0 small text-blue mb-0"}>&#10045; required</p>
                        </div>
                    </div>

                    <div className={"form-group row mb-6"}>
                        <label className={"col-auto"}>Genre</label>
                        <input name="genre"
                               onChange={e => setBookGenre(e.target.value)}
                               className={"form-control col"}/>
                        <small className="text-danger">{formErrors["genre"]}</small>
                    </div>
                    <div className="row">
                    <span>
                        </span>
                        <label className={"col-auto text-small text-plain"}>
                            {startNew
                                ? <CheckIcon
                                    stroke={"#0C00FF"}
                                    className={"btn-icon mr-2 mb-1 ml-1"}
                                    onClick={triggerStartNew}
                                /> : <CircleIcon onClick={triggerStartNew}
                                                 className={"btn-icon mr-2 mb-1 ml-1"}
                                                 stroke={"#0C00FF"}/>}
                            Use this verse to seed a
                            new poem, too.</label>
                    </div>
                    <div className={"row mt-2"}>
                        <button className={"col-auto btn btn-primary btn-submit text-center"}
                                type={"submit"}>
                            SUBMIT
                        </button>
                    </div>
                </form>
                <br/><br/><br/>
            </div>
        </>);
};
Play.propTypes = {
    data: PropTypes.object
};

export default Play;
