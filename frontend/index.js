import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Base from "./components/global/Base";
import ErrorNotFoundComponent from "./components/ErrorNotFoundComponent";
import ExampleId from "./components/ExampleId";
import Home from "./components/Home";
import About from "./components/About";
import Play from "./components/Play";
import Instructions from "./components/Instructions";
import Read from "./components/Read";
import ReadDisplay from "./components/ReadDisplay";
const COMPONENT_PROPS_RAW = document.getElementById("component_props").text;
const COMPONENT_NAME_RAW = document.getElementById("component_name").text;
const COMPONENT_PROPS = JSON.parse(COMPONENT_PROPS_RAW);
const COMPONENT_NAME = JSON.parse(COMPONENT_NAME_RAW);

const COMPONENTS = {
    ErrorNotFoundComponent,
    ExampleId,
    Home,
    About,
    Instructions,
    Play,
    Read,
    ReadDisplay
};

const PreselectedComponent = COMPONENTS[COMPONENT_NAME || "ErrorNotFoundComponent"];

ReactDOM.render(
    <Base>
        <PreselectedComponent {...COMPONENT_PROPS} />
    </Base>,
    document.getElementById("app_root")
);
