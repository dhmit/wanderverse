import React, {useState} from "react";
import * as PropTypes from "prop-types";
import W from "../images/icons/w.svg";

const Random = ({data}) => {

    const [tracker, setTracker] = useState(0);

    const onButtonClick = () => {
        setTracker(previousState => previousState + 1);
    };
    const verses = data.map((line, idx) => {
        return <li key={idx}>{line}</li>;
    });
    console.log("verses", verses, data);
    return (
        <div className={"text-center"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <div className="example">
                <h1>A Wanderverse</h1>

                <p>View params:</p>
                <ul className="list">
                    {verses}
                </ul>
                <p>Example state: {tracker}</p>
                <button onClick={onButtonClick}>Add to tracker</button>
            </div>
        </div>
    );
};

Random.propTypes = {
    data: PropTypes.array
};

export default Random;
