import React from "react";
import W from "../../images/icons/w.svg";

const Nav = () => {

    return (
        <nav className="navbar fixed-bottom navbar-light bg-light navbar-expand-sm">
            <ul className="nav mr-auto">
                <li className="nav-item mr-2">
                    <a href={"/"}>
                        <W width={"20px"} fill={"#0C00FF"}/>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="/about">ABOUT</a>
                </li>


            </ul>
            <a className="nav-item lab-link" href="https://digitalhumanities.mit.edu/"
               target="_blank"
               rel="noreferrer">
                DH
            </a>

        </nav>
    );
};

export default Nav;
