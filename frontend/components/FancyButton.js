import React from "react";
import PropTypes from "prop-types";

class FancyButton extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        href: PropTypes.string,
        extraClass: PropTypes.string,
    };

    render() {
        return <>
            {this.props.href && <a href={this.props.href}>
                <button className={`btn btn-fancy ${this.props.extraClass}`}>
                    {this.props.title}
                </button>
            </a>}
            {!this.props.href && <button className={`btn btn-fancy ${this.props.extraClass}`}>
                {this.props.title}
            </button>}
        </>;
    }
}

export default FancyButton;
