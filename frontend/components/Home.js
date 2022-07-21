import React from "react";
import FancyButton from "./FancyButton";
// import Dropdown from 'react-bootstrap/Dropdown';
import Logo from "../images/logo2.svg";

const Home = () => {
    return (
        <div className={"text-center"}>
            <a href={"/"}>
                <Logo height={"10em"} className={"mb-2 mt-4"} fill={"#3D2DFD"}/>
            </a>
            <h3 className={"subtitle mb-5"}>A collaborative poetry project </h3>
            <FancyButton title={"Play"}
                         href={"instructions/"}
                         extraClass={"btn-primary"}/>
            {/*<Dropdown>*/}
            {/*    <Dropdown.Toggle variant="btn-primary" id="dropdown-basic">*/}
            {/*        {location}*/}
            {/*    </Dropdown.Toggle>*/}

            {/*    <Dropdown.Menu>*/}
            {/*        <Dropdown.Item as="button" onClick={(e) => setLocation(e.target.textContent)}>at*/}
            {/*            MIT</Dropdown.Item>*/}
            {/*        <Dropdown.Item as="button" onClick={(e) => setLocation(e.target.textContent)}>Everywhere*/}
            {/*            Else</Dropdown.Item>*/}
            {/*    </Dropdown.Menu>*/}
            {/*</Dropdown>*/}
            <FancyButton title={"Read"}
                         href={"read/"}
                         extraClass={"btn-secondary"}/>
            <br/><br/>
        </div>
    );
};

export default Home;
