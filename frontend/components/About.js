import React from "react";
import Logo from "../images/logo.svg";
import CAMIT from "../images/supporters/camit.svg"
import SectionSymbols from "./SectionSymbols";

class About extends React.Component {
    render() {
        return <div className="about text-center">
            <a href={"/"}>
                <Logo className="mb-4" height="10em" fill="white"/>
            </a>
            <div className="text-left">
                <p>The Wanderverse Project is a collaborative poetry treasure hunt game. Each
                    co-created poem is called a “wanderverse.” The purpose of this project is to
                    draw the MIT public in to explore spaces in Hayden Library they wouldn't
                    otherwise get a chance to visit, and to promote stack browsing.
                </p>
                <p>
                    The Wanderverse Project is made with generous support from the <a
                    href={"https://arts.mit.edu/camit/"}>Council for the Arts at MIT</a>. It was
                    created by Clare Stanton (<a href={"https://lil.law.harvard.edu"}>LIL</a>), Andy
                    Silva (<a href={"https://lil.law.harvard.edu"}>LIL</a>), and Anastasia Aizman
                    (<a href={"https://digitalhumanities.mit.edu/"}>DH Lab</a>
                    ). It was built at MIT's <a href={"https://digitalhumanities.mit.edu/"}>
                    Digital Humanities Lab</a> in collaboration with Ece Turnator and Mark Szarko of
                    MIT Libraries.
                </p>
                <p>
                    Say hi: <a href="mailto:wanderverse@mit.edu">wanderverse@mit.edu</a>.
                </p>
                <SectionSymbols/>
                <div className="supporters">
                    <p>Funded by:</p>
                    <a href="https://arts.mit.edu/camit/" target="_blank" rel="noreferrer">
                        <CAMIT height="3em" fill="#CEB6F8"/>
                    </a>
                </div>
            </div>
        </div>;
    }
}

export default About;
