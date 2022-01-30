
// client for arttour

import React from 'react';
import $ from 'jquery';

/* global Auth0Lock */
// import Auth0Lock from 'auth0-lock'; //. nowork - adding to index.html for now
// see http://stackoverflow.com/questions/33354352/importing-remote-files-via-es6-import

/* global localStorage */

import horizontalscrolling from '../lib/horizontalscrolling';

import AppAbout from './AppAbout';
import AppTitle from './AppTitle';
import AppUser from './AppUser';
import Gallery from './Gallery';
import Menu from './Menu';
import Map from './Map';


//. store this elsewhere, a config file outside the repo?
var auth0clientId = 'z6gj5q92f3Sa8qWQ7kNTcmUC1CTVdWk2';
var auth0domain = 'owl-syme.auth0.com';



var App = React.createClass({

    getInitialState: function () {
        //. set state of menu open or closed based on size of screen available
        //. would also need to handle resize events
        // any way to do it purely in css? i don't think so, because it's dynamic, responding to clicks
        return {
            artworks: [],
            options: {
                artist: null,
                city: null,
                country: null,
                tag: null,
                sortby: 'random',
                offset: 0,
                limit: 10,
                // limit: 3,
            },
            moreAvailable: false,
            menuOpen: true,
            // user_id: 0,
            user_id: 1, //. for now
        };
    },

    // get page of artworks from server's artworks endpoint matching filter and sort order
    _getArtworks: function (options = {}, more) {

        //. clean this up

        if (!more) {
            options.offset = 0;
        }

        var state = this.state;
        state.options.artist = options.artist;
        state.options.city = options.city;
        state.options.country = options.country;
        state.options.tag = options.tag;
        state.options.sortby = options.sortby;
        state.options.offset = options.offset;
        state.options.limit = options.limit;

        var params = {}; // params to pass to server
        if (options.artist) params.artist = options.artist;
        if (options.city) params.city = options.city;
        if (options.country) params.country = options.country;
        if (options.tag) params.tag = options.tag;
        if (options.sortby) params.sort = options.sortby;
        if (options.offset) params.offset = options.offset;
        if (options.limit) params.limit = options.limit;

        // console.log('getArtworks: ' + artist);

        $.ajax({
            url: 'artworks', // our api endpoint
            data: params, // pass in data in form of ?artist=inness&sort=oldest_first
            dataType: 'json',
            cache: false,
            success: function (json) {
                // set state of this component to the data returned from the server
                let artworks = json.artworks;
                let moreAvailable = json.moreAvailable; // more artworks available?
                // can create calculated fields here, rather than make server calculate them
                // seems awkward putting it here though
                // for (let artwork of artworks) {
                //     if (artwork.state) {
                //         artwork.place = artwork.name + ', ' + artwork.city + ', ' + artwork.state; 
                //     } else {
                //         artwork.place = artwork.name + ', ' + artwork.city;
                //     }
                // }
                state.options.offset += state.options.limit;
                // if user clicked [more], append to existing list - otherwise start over
                if (more) {
                    state.artworks = state.artworks.concat(artworks);
                } else {
                    state.artworks = artworks;
                }
                state.moreAvailable = moreAvailable;
                this.setState(state);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                this.setState(state); // just the search string
            }.bind(this)
        });
    },

    // called once, *before* initial render
    // It is important to note that setting the state in this phase will not trigger a re-rendering.
    componentWillMount: function () {
        let options = this.state.options;
        this._getArtworks(options);
        this._createLock();
        // Set the state with a property that has the token
        this.setState({ idToken: this._getIdToken() });
    },

    _createLock: function () {
        // this.lock = new Auth0Lock(this.props.clientId, this.props.domain);
        this.lock = new Auth0Lock(auth0clientId, auth0domain);
    },

    _getIdToken: function () {
        // First, check if there is already a JWT in local storage
        var idToken = localStorage.getItem('id_token');
        var authHash = this.lock.parseHash(window.location.hash);
        // If there is no JWT in local storage and there is one in the URL hash,
        // save it in local storage
        if (!idToken && authHash) {
            if (authHash.id_token) {
                idToken = authHash.id_token;
                localStorage.setItem('id_token', authHash.id_token);
            }
            if (authHash.error) {
                // Handle any error conditions
                console.log("Error signing in", authHash);
            }
        }
        return idToken;
    },

    _onClickMenuButton: function () {
        this.setState({ menuOpen: !this.state.menuOpen });
    },

    _toggleFav: function (id) {
        // artwork.favorite = !artwork.favorite;
        var artworks = this.state.artworks; // a list
        for (let artwork of artworks) {
            if (artwork.artwork_id === id) {
                artwork.favorite = !artwork.favorite;
                break;
            }
        }
        this.setState({ artworks });
    },

    // on click star, toggle favorite
    _onClickFav: function (artwork) {
        // change fav state optimistically
        this._toggleFav(artwork.artwork_id);

        // http method to use on endpoint
        let method = artwork.favorite ? 'POST' : 'DELETE';

        // tell server about the fav/unfav
        // if error, reverse local action
        $.ajax({
            // api endpoint, eg '/users/15/favorites/3'
            url: `/users/${this.state.user_id}/favorites/${artwork.artwork_id}`,
            dataType: 'json',
            cache: false,
            method: method,
            success: function (s) {
                // do nothing
                console.log('success!');
            }.bind(this),
            error: function (xhr, status, err) {
                // on error, undo the local state change
                console.error(this.props.url, status, err.toString());
                this._toggleFav(artwork.artwork_id);
            }.bind(this)
        });
    },

    _onFilterArtist: function (artist) {
        let options = this.state.options;
        options.artist = artist;
        this._getArtworks(options);
    },

    _onFilterCity: function (city) {
        let options = this.state.options;
        options.city = city;
        this._getArtworks(options);
    },

    _onFilterCountry: function (country) {
        let options = this.state.options;
        options.country = country;
        this._getArtworks(options);
    },

    _onFilterFavorites: function (event) {
        var filterFavorites = event.target.checked;
        var tag = filterFavorites ? 'favorite' : null;
        let options = this.state.options;
        options.tag = tag;
        this._getArtworks(options);
    },

    _onChangeSortOrder: function (sortby) {
        let options = this.state.options;
        options.sortby = sortby;
        this._getArtworks(options);
    },

    // click on artist name in gallery
    _onClickArtist: function (artist) {
        let options = this.state.options;
        options.artist = artist;
        this._getArtworks(options);
    },

    // click on city name in gallery
    _onClickCity: function (city) {
        let options = this.state.options;
        options.city = city;
        this._getArtworks(options);
    },

    // click on country name in gallery
    _onClickCountry: function (country) {
        let options = this.state.options;
        options.country = country;
        this._getArtworks(options);
    },

    _onClickMore: function () {
        let options = this.state.options;
        if (this.state.moreAvailable) {
            this._getArtworks(options, true);
        }
    },

    render: function () {

        //. would set state of menu open or closed based on size of screen available, in getInitialState
        // then user would toggle it with the buttons in Menu
        // or could it be purely set within the Menu component?
        // on its initialstate event check how much room avail, and handle resize events also?
        var styleContents = { marginLeft: this.state.menuOpen ? '15em' : '0' };

        // filter artworks
        //.. this will take place on server
        // var artworks = this.state.artworks;
        // if (this.state.options.filterFavorites) {
        //     artworks = artworks.filter(function(artwork) {return artwork.fav;}); // filter list
        // }

        //     if (this.state.idToken) {
        //       return (<LoggedIn lock={this.lock} idToken={this.state.idToken} />);
        //     } else {
        //       return (<Home lock={this.lock} />);
        //     }

        // <AppAbout />
        return (
            <div id="page">

                <AppTitle onClickMenuButton={this._onClickMenuButton} />
                <AppUser lock={this.lock} idToken={this.state.idToken} />

                <Menu
                    artist={this.state.options.artist}
                    city={this.state.options.city}
                    country={this.state.options.country}
                    menuOpen={this.state.menuOpen}
                    onFilterArtist={this._onFilterArtist}
                    onFilterCity={this._onFilterCity}
                    onFilterCountry={this._onFilterCountry}
                    onFilterFavorites={this._onFilterFavorites}
                    onChangeSortOrder={this._onChangeSortOrder}
                />

                <div id="contents" style={styleContents}>

                    <Gallery
                        artworks={this.state.artworks}
                        filterFavorites={this.state.options.filterFavorites}
                        onClickFav={this._onClickFav}
                        onClickArtist={this._onClickArtist}
                        onClickCity={this._onClickCity}
                        onClickCountry={this._onClickCountry}
                        onClickMore={this._onClickMore}
                        moreAvailable={this.state.moreAvailable}
                    />

                    <Map
                        artworks={this.state.artworks}
                        filterFavorites={this.state.options.filterFavorites}
                    />

                </div>

            </div>
        );
    },

    // this just gets called once, *after* initial render
    componentDidMount: function () {
        horizontalscrolling('gallery-images'); // doesn't exist until react has rendered the dom
        $('#gallery-images').focus(); // setfocus here instead of search box, which causes problems on mobile. note: need tabIndex="0" also in the div
    },

    // Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
    // Use this as an opportunity to operate on the DOM when the component has been updated.
    componentDidUpdate: function () {
        // nowork
        // $('#gallery-images')[0].scrollBy(200);
        // $('#gallery-images').scrollTo(250);
    }


});


export default App;

