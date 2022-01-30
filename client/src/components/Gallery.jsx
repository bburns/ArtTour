// show a browseable gallery of artworks

import React from 'react';

import GalleryArtwork from './GalleryArtwork';


var Gallery = React.createClass({

    propTypes: {
        artworks: React.PropTypes.array.isRequired,
        onClickFav: React.PropTypes.func.isRequired,
        onClickArtist: React.PropTypes.func.isRequired,
        onClickCity: React.PropTypes.func.isRequired,
        onClickCountry: React.PropTypes.func.isRequired,
        onClickMore: React.PropTypes.func.isRequired,
        // filterFavorites: React.PropTypes.bool.isRequired,
        moreAvailable: React.PropTypes.bool.isRequired,
    },

    render: function () {

        var artworks = this.props.artworks;

        // else lose 'this' inside .map fn
        var getArtworks = this.props.getArtworks;
        var onClickFav = this.props.onClickFav;
        var onClickArtist = this.props.onClickArtist;
        var onClickCity = this.props.onClickCity;
        var onClickCountry = this.props.onClickCountry;

        var artworkNodes = artworks.map(function (artwork) {
            return (
                <GalleryArtwork
                    artwork={artwork}
                    key={artwork.artwork_id}
                    onClickArtist={onClickArtist}
                    onClickCity={onClickCity}
                    onClickCountry={onClickCountry}
                    onClickFav={onClickFav}
                >
                </GalleryArtwork>
            );
        });
        // <i className="glyphicon glyphicon-picture"></i>
        // <h2>Gallery</h2>
        // alert(this.props.getArtworks);

        return (
            <div id="gallery">
                <div id="gallery-images" tabIndex="0">
                    {artworkNodes}

                    <div className="more">
                        <a href="#"
                            className={this.props.moreAvailable ? '' : 'more-disabled'}
                            onClick={this.props.onClickMore}>[more]</a>
                    </div>

                </div>
            </div>
        );
    }
});

export default Gallery;
