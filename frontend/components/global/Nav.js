import React from "react";
import DH_LOGO from "../../images/dh_logo.svg";

const Nav = () => {

    return (
        <nav className="navbar fixed-bottom navbar-light bg-light navbar-expand-sm">
            {/*<a className="navbar-brand link-home" href="/">ABOUT app</a>*/}
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a href="/about">ABOUT</a>
                </li>
            </ul>
            <a className="nav-item lab-link" href="https://digitalhumanities.mit.edu/" target="_blank"
               rel="noreferrer">
                DH
            </a>
        </nav>
    );
};

export default Nav;
