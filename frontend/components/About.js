import React from "react";
import W from "../images/icons/w.svg";


class About extends React.Component {
    render() {
        return <div className={"text-center"}>
            <a href={"/"}><W height={"80px"} className={"2 mb-4"}/></a>
            <div>This is About</div>
        </div>;
    }
}

export default About;
