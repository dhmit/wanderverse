import React, {useEffect, useRef, useState} from "react";
import * as PropTypes from "prop-types";
import Logo from "../images/logo.svg";
import Symbol from "./Symbol";


const ReadDisplay = ({data}) => {
    const [citesShown, showCites] = useState(true);
    // adding line dividers until the last line of the poem
    const content = JSON.parse(data.verses);
    const messagesEndRef = useRef(null);

    const getInfo = (line, idx) => {
        let infoText = "("
        if (line.page_number) {
            infoText += "p. " + line.page_number + ", ";
        }
        if (line.book_title) {
            infoText += line.book_title + ", ";
        }
        if (line.author) {
            infoText += line.author;
        }
        infoText += ")";
        infoText = infoText === "()" ? "" : infoText;
        return <span key={`info-${idx}`}
                     className={"text-citation"}>
            {infoText}
        </span>
    }

    const verses = content.map((line, idx) => {
        let info = getInfo(line, idx);
        return <>
            <li className={"verse-container"} key={`verse-container-${idx}`}>
                <span key={`verse-${idx}`} className={"verse"}>
                        {line.text} {info} <span className={"text-citation"}>/</span>
                </span>
            </li>
        </>;
    });

    return (
        <div id="display" className={"pt-4 pl-4 pr-4 pb-2"}>
            <div className={"left-side"}>
                <div
                    className={"logo-container"}>
                    <Logo className={"w ml-3 mb-5"} fill={"#0C00FF"}/>
                    <p>
                        <a href={"/"}>wanderverse.dhlab.mit.edu</a>
                    </p>
                </div>
            </div>
            <div className={"right-side"}>
                <div className="wanderverse-container text-left">
                    <div className={"new-verse marquee"}>
                        <ul className="list">
                            <li className={"verse-container"}>
                            <span className={"verse"}>
Minima officiis praesentium cumque ipsam deleniti sit sed. Et neque cum quia dolorem doloremque. Enim debitis nam nihil. Error nisi aut ut dignissimos enim impedit voluptas occaecati. Quo et ex voluptatem.

Velit qui nisi expedita. Quod velit quisquam accusantium fugiat qui velit aut at. Sunt aut nihil et quibusdam. Est quam excepturi dolorum totam facere perspiciatis dolorem. Rem in accusantium eos quasi hic. Soluta quia occaecati ut autem.

Consequatur esse sit quaerat omnis et non eum. Dignissimos ut unde minima. Voluptates non porro atque dolor dolores quia sit.

Et voluptas sequi eos repudiandae quos non. Ea atque doloremque unde enim. Aut deserunt sequi nihil est quia quo maiores illum. Facere tempore commodi dicta. Numquam ipsum ab magnam quo voluptas earum. Sit libero dolor error atque eaque laboriosam aut.

Suscipit ipsa impedit nulla pariatur ducimus rerum. Cupiditate quia maxime voluptatem explicabo nobis. Tempora aliquam maiores amet minima rem commodi est occaecati. Et repellendus omnis veritatis.
 <span className={"text-citation"}>/</span>
                </span>
                            </li>
                            {verses}
                            <div
                                ref={messagesEndRef}>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

ReadDisplay.propTypes = {
    data: PropTypes.object
};

export default ReadDisplay;
