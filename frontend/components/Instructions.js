import React from "react";
import * as PropTypes from "prop-types";


const Instructions = ({rules}) => {

    const rulesList = rules.map((line, idx) => {
        return <li key={idx}>{line}</li>;
    });

    return (
        <div className={"text-center"}>
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
