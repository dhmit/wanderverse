import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Symbol from "./Symbol";

const FancyButton = ({href, extraClass, title}) => {
    const [leftSymbols, setLeftSymbols] = useState([]);
    const [rightSymbols, setRightSymbols] = useState([]);
    let bool = Math.random() < 0.5;
    const getPosition = (position) => {
        let max = 10;
        let min = 0;
        if (position === "left") {
            max = 150;
            min = 50;
            bool = false;
        } else if (position === "top") {
            max = 30;
            bool = true;
        } else if (position === "bottom") {
            max = 10;
        } else if (position === "right") {
            max = 150;
            min = 50;
            bool = true;
        }
        return bool ? -1 * (Math.floor(Math.random() * (max - min) + min)) + "px" : Math.floor(Math.random() * (max - min) + min);
    }

    const createRandomSymbols = (side) => {
        let rand = Math.floor(Math.random() * (10 - 4) + 4);
        let arr = [];
        for (let i = 0; i < rand; i++) {
            arr.push(<Symbol key={i} left={getPosition(side)} top={getPosition("top")}/>)
        }
        return arr;
    }

    useEffect(() => {
        setLeftSymbols(createRandomSymbols("left"));
        setRightSymbols(createRandomSymbols("right"));
    }, [])
    return (
        <>
            <div className={"row"}>

                <div className={"col-4 p-0"}>{leftSymbols}</div>
                <div className={"col-4 p-0"}>
                    {title &&
                    <div className={"btn-container"}>
                        <a href={href} className={`btn btn-fancy ${extraClass}`}>
                            {title}
                        </a>
                    </div>
                    }
                </div>
                <div className={"col-4 p-0"}>
                    {rightSymbols}
                </div>
            </div>
        </>
    )
}

FancyButton.propTypes = {
    title: PropTypes.string,
    href: PropTypes.string,
    extraClass: PropTypes.string,
};

export default FancyButton;
