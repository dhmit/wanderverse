import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Symbol from "./Symbol";

const FancyButton = ({href, extraClass = "", title, extraClassContainer = ""}) => {
    const [leftSymbols, setLeftSymbols] = useState([]);
    const [rightSymbols, setRightSymbols] = useState([]);

    const getPosition = (position) => {
        let containerWidth = document.getElementById("main-container").offsetWidth / 2;
        let max = 10;
        let min = 0;
        if (position === "left") {
            max = window.innerWidth - containerWidth;
            min = 50;
        } else if (position === "top") {
            max = 20;
        }
        return Math.floor(Math.random() * (max - min) + min) + "px";
    }

    const createRandomSymbols = (side) => {
        let rand = Math.floor(Math.random() * 20 + 4);
        let arr = [];
        for (let i = 0; i < rand; i++) {
            arr.push(<Symbol extraClass={"symbol"} key={i}
                             top={getPosition("top")}
                             left={getPosition(side)}/>);
        }
        return arr;
    }

    const refreshSymbols = () => {
        setLeftSymbols(createRandomSymbols("left"));
        setRightSymbols(createRandomSymbols("left"));
    }

    useEffect(() => {
        refreshSymbols();
        setInterval(() => {
            refreshSymbols();
        }, 2500);
    }, []);

    return (
        <div className={`fancy-btn-container ${extraClassContainer}`}>
            <div className={"row"}>
                {leftSymbols}
                {title &&
                <div className={"btn-container"}>
                    <a href={href} onMouseEnter={refreshSymbols}
                       onMouseLeave={refreshSymbols}
                       onTouchStart={refreshSymbols}
                       className={`btn btn-fancy ${extraClass}`}>
                        {title}
                    </a>
                </div>}
                {rightSymbols}
            </div>
        </div>
    )
}

FancyButton.propTypes = {
    title: PropTypes.string,
    href: PropTypes.string,
    extraClass: PropTypes.string,
    extraClassContainer: PropTypes.string,
};

export default FancyButton;
