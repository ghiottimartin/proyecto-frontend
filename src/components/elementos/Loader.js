import React from "react";
import "../../assets/css/Loader.css";

export default class Loader extends React.Component {
    render() {
        return (
            <div style={{display: this.props.display ? "block" : "none"}} className="half-circle-spinner center-block">
                <div className="circle circle-1"/>
                <div className="circle circle-2"/>
            </div>
        )
    }
}