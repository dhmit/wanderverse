import React from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";
import SectionSymbols from "./SectionSymbols";

const Random = ({data}) => {
    console.log("verses", data);
    const verses = data.exquisite_verse.map((line, idx) => {
        return <li key={idx}>{line}</li>;
    });
    return (
        <div className={"text-center pt-4 pl-4 pr-4 pb-2"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <div className="example">
                <h3 className={"col-auto"}>A Wanderverse</h3>

                <ul className="list text-left">
                    {verses}
                </ul>
            </div>
            <SectionSymbols/>

        </div>
    );
};

Random.propTypes = {
    data: PropTypes.array
};

export default Random;
