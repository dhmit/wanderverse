import React from "react";
import W from "../images/icons/w.svg";
import * as PropTypes from "prop-types";


const Instructions = ({rules}) => {

    const rulesList = rules.map((line, idx) => {
        return <li key={idx}>{line}</li>;
    });

    return (
        <div className={"text-center"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <div>Instructions</div>
            <ul className="list">
                {rulesList}
            </ul>
        </div>);
};

Instructions.propTypes = {
    rules: PropTypes.array
};
export default Instructions;
