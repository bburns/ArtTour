// show an artwork in the gallery

import React from 'react';


var GalleryArtwork = React.createClass({

    propTypes: {
        artwork: React.PropTypes.object.isRequired,
        onClickFav: React.PropTypes.func.isRequired,
        onClickArtist: React.PropTypes.func.isRequired,
        onClickCity: React.PropTypes.func.isRequired,
        onClickCountry: React.PropTypes.func.isRequired,
    },

    // handle click on an artist name
    _handleClickArtist: function (event) {
        event.preventDefault();
        var artist = event.currentTarget.innerHTML;
        this.props.onClickArtist(artist);
    },

    // handle click on an city name
    _handleClickCity: function (event) {
        event.preventDefault();
        var city = event.currentTarget.innerHTML;
        this.props.onClickCity(city);
    },

    // handle click on an country name
    _handleClickCountry: function (event) {
        event.preventDefault();
        var country = event.currentTarget.innerHTML;
        this.props.onClickCountry(country);
    },

    // _onClickFav: function() {
    //     // alert('pokpok');
    //     this.props.artwork.fav = !this.props.artwork.fav;
    // },

    render: function () {

        var artwork = this.props.artwork;

        var imageHeight = artwork.imageHeight;
        var actualDims = artwork.dims || ''; // eg '127x102cm'
        var dimsSplit = actualDims.split('x');
        var actualHeight = dimsSplit[0]; // eg '127'
        var actualUnits = actualDims.slice(-2); // eg 'cm' or 'in'
        if (actualUnits === 'cm')
            actualHeight = actualHeight / 2.54; // cm to inches

        // if no information available...
        if (actualHeight <= 0)
            actualHeight = 20; // inches

        const wallHeightInches = 10 * 12; // 10' high walls
        var heightPct = actualHeight / wallHeightInches;

        // or const height...
        // var heightPct = 0.75;
        var heightPct = 1;

        // note: the full size image for the lightbox is hidden initially
        //. should load it only when clicked on
        // see http://codepen.io/gschier/pen/HCoqh

        // var favClass = (artwork.fav) ? "artwork-fav-heart fa fa-heart" : "artwork-fav-unheart fa fa-heart-o";
        // var favClass = (artwork.fav) ? "artwork-fav-star fa fa-star" : "artwork-fav-unstar fa fa-star-o";
        var favClass = (artwork.favorite) ? "artwork-fav-star fa fa-star" : "artwork-fav-unstar fa fa-star-o";

        // <a href="#" onClick={this._handleClickArtist} className="artwork-artist">{artwork.artist}</a>
        // <div className="artwork-location">{artwork.location}</div>

        //. might someday split up the location into museum, city, state, country and click on any of them
        return (
            <div className="artwork">

                <a href={"#img" + artwork.artwork_id}>
                    <img className="artwork-image" src={"images/" + artwork.image} height={heightPct * 100 + "%"} width="auto"></img>
                </a>

                <a href="#_" className="lightbox" id={"img" + artwork.artwork_id}>
                    <img src={"images/" + artwork.image} />
                </a>

                <div className="artwork-label">

                    <div className="artwork-title">{artwork.title}
                        <i className={favClass} onClick={this.props.onClickFav.bind(null, artwork)}></i>
                    </div>
                    <a href="#" onClick={this._handleClickArtist} className="artwork-artist">{artwork.last_first}</a>
                    <div className="artwork-year">{artwork.year}</div>
                    <div className="artwork-location">
                        {artwork.name}, <a href="#" onClick={this._handleClickCity}>{artwork.city}</a>{(artwork.state) ? ', ' + artwork.state : ''}, <a href="#" onClick={this._handleClickCountry}>{artwork.country}</a>
                    </div>
                    <div className="artwork-dims">{artwork.dims}</div>
                </div>

            </div>
        );
    }
});

export default GalleryArtwork;
