import React from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";
import X from "../images/icons/x.svg";
import DownArrow from "../images/icons/down-arrow.svg";


const Instructions = ({instructionsText, instructionsClass, rules, dismissModal, verse}) => {

    return (
        <div
            className={`instructions-overlay text-center pt-4 pl-4 pr-4 pb-2 ${instructionsClass}`}>
            <a href={"/"}>
                <W height={"80px"} fill={"black"} stroke={"black"} className={"w mb-4"}/></a>
            <h1 className={"page-title"}>Play</h1>
            <h2 className={"text-left"}>Last line of poem to extend:</h2>
            <div id={"exquisite-verse"} className={"font-calmius text-left"}>
                {verse}
            </div>
            <div className={"rules text-left mt-4 pb-2"}>
                <div className={"instructions-title"}>
                    <div className={"page-title row mb-2 mr-1"}>
                        <div className={"col-auto"}>Instructions</div>
                        <div className={"col hr mb-2"}/>
                    </div>

                </div>
                <ul className="rules-list">
                    {rules.map((line, idx) => {
                        return <li key={idx}>{line}</li>;
                    })}
                </ul>
            </div>
            <div className={"row btn-row"}>
                <button className={"btn btn-tertiary btn-dismiss mt-2 mx-auto"}
                        onClick={dismissModal}>
                    {instructionsText}
                    <br/>
                    {instructionsText.indexOf("Exit") > -1
                        ? <X width={"10px"} height={"10px"}/>
                        : <DownArrow width={"10px"} height={"10px"}/>
                    }
                </button>
            </div>
        </div>
    );
};

Instructions.propTypes = {
    rules: PropTypes.array,
    instructionsText: PropTypes.array,
    instructionsClass: PropTypes.string,
    dismissModal: PropTypes.func,
    verse: PropTypes.array
};
export default Instructions;
