s
import React from 'react';

var AppTitle = React.createClass({

    showLock: function () {
        // show the auth0lock widget
        this.props.lock.show();
    },

    render: function () {
        // <span><a href="#" className="title-menu-button"onClick={this.props.onClickMenuButton}>Menu</a></span>
        // <a href="login.html" id="user-login">Login</a> |

        // let user = (this.props.idToken) ?
        // (<LoggedIn lock={this.props.lock} idToken={this.props.idToken} />)
        // :
        // (<Home lock={this.props.lock} />);
        // if (this.props.idToken) {
        // return (<LoggedIn lock={this.props.lock} idToken={this.props.idToken} />);
        // } else {
        // return (<Home lock={this.props.lock} />);
        // }
        // <a href="#" id="user-login" onClick={this.showLock} >Login</a> |
        // <a href="#" id="user-register">Register</a>

        // <span id="user">
        // {this.props.idToken ? 'welcome!' : 'whoru'}
        // <a href="#" id="user-login" onClick={this.showLock} >Login</a> |
        // <a href="#" id="user-register">Register</a>
        // </span>

        return (
            <div id="title">
                <span id="title-logo">Logo</span>
                <span id="title-caption">Art Tour</span>
            </div>
        );
    }
});

export default AppTitle;
