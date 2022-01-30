
import React from 'react';

var AppUser = React.createClass({

    showLock: function () {
        // show the auth0lock widget
        this.props.lock.show();
    },

    render: function () {
        if (this.props.idToken) {
            return (<AppUserWelcomeLogout lock={this.props.lock} idToken={this.props.idToken} />);
        } else {
            return (<AppUserLoginRegister lock={this.props.lock} idToken={this.props.idToken} />);
        }
    }
});


var AppUserLoginRegister = React.createClass({
    _showLock: function () {
        // show the auth0lock widget
        this.props.lock.show();
    },
    render: function () {
        return (
            <div id="user">
                <a href="#" onClick={this._showLock} >Login/Sign Up</a>
            </div>
        );
    }
});


var AppUserWelcomeLogout = React.createClass({

    getInitialState: function () {
        return {
            profile: null
        };
    },

    componentDidMount: function () {
        // The token is passed down from the App component 
        // and used to retrieve the profile
        this.props.lock.getProfile(this.props.idToken, function (err, profile) {
            if (err) {
                console.log("Error loading the Profile", err);
                return;
            }
            this.setState({ profile: profile });
        }.bind(this));
    },

    _showProfile: function () {
        alert('show profile');
    },

    _logout: function () {
        localStorage.removeItem('id_token');
        // Redirect to the home route
        // works for now -
        // see http://stackoverflow.com/questions/29594720/automatic-redirect-after-login-with-react-router
        window.location = '/';
    },

    render: function () {
        if (this.state.profile) {
            // works but huge
            // <img src={this.state.profile.picture} />
            return (
                <div id="user">
                    <span>Welcome, <a href="#" onClick={this._showProfile} >{this.state.profile.nickname}</a>!</span> |
                    <a href="#" onClick={this._logout} >Logout</a>
                </div>
            );
        } else {
            return (
                <div className="loading">Loading profile...</div>
            );
        }
    }
});


export default AppUser;
