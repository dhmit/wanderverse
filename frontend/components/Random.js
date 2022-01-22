import React from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";

const Random = ({data}) => {

    return (
        <div className={"text-center"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <div className="example">
                <h1>A Wanderverse</h1>

                <ul className="list">
                    {data.exquisite_verse}
                </ul>
            </div>
        </div>
    );
};

Random.propTypes = {
    data: PropTypes.object
};

export default Random;
