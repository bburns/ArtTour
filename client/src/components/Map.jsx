// draw a map with pushpins for museum locations

import React from 'react';
import lib from '../lib/lib';


var initialPosition = { lat: 42.374685, lng: -71.11457 }; // fogg art museum, cambridge
var initialZoom = 3;


var Map = React.createClass({
    propTypes: {
        // artworks: React.PropTypes.object.isRequired,
        artworks: React.PropTypes.array.isRequired,
        // filterFavorites: React.PropTypes.bool.isRequired,
    },
    render: function () {
        return (
            <div id='map'>
                <div id='map-image'></div>
                <MapContents artworks={this.props.artworks} />
            </div>
        );
    }
});


var MapContents = React.createClass({

    propTypes: {
        artworks: React.PropTypes.array.isRequired,
    },

    initMap: function () {
        var mapDiv = document.getElementById('map-image');
        var latlng = new google.maps.LatLng(initialPosition.lat, initialPosition.lng);
        var options = { center: latlng, zoom: initialZoom };
        var map = new google.maps.Map(mapDiv, options);
        // add click handler to dismiss infoboxes
        google.maps.event.addListener(map, "click", function (event) {
            this.removeInfoboxes();
        }.bind(this));
        return map;
    },

    // problem is, this is called before the parent elements are rendered,
    // so the map-image div doesn't exist yet, so it can't find it.
    // componentWillMount: function() {
    //     this.map = this.initMap();
    // },

    // this only gets called once *after* initial render
    componentDidMount: function () {
        this.map = this.initMap();
    },

    //. need .lat .lng .name .location ._id
    addMarker: function (location) {

        if (location && location.lat) {
            var latlng = new google.maps.LatLng(location.lat, location.lng);

            var marker = new google.maps.Marker({
                map: this.map,
                position: latlng, // required
                title: location.name // shows on hover
                // attribution: {source:'ArtTour', webUrl: 'http://owl-syme.org/arttour'},
            });

            // build infobox for this location
            // go through selected artworks at this location and add their images at reduced size
            var s = "<h3>" + location.name + "</h3><p>" + location.city + "</p>";

            let artworks = this.props.artworks;

            s += "<div class='infobox'>";
            for (let artwork of artworks) {
                // if (artwork.location_id == location._id) {
                if (artwork.location_id == location.location_id) {
                    var filename = 'images/' + artwork.image;
                    s += "<div class='infobox-artwork'>";
                    s += "<img class='infobox-image' src=\"" + filename + "\" width='50%' height='auto'  />";
                    s += "<div class='infobox-description'>";
                    s += "<div class='infobox-title'>" + artwork.title + "</div>";
                    s += "<div class='infobox-artist'>" + artwork.last_first + "</div>";
                    s += "<div class='infobox-year'>" + (artwork.year || '') + "</div>";
                    s += "<div class='infobox-dims'>" + (artwork.dims || '') + "</div>";
                    s += "</div>";
                    s += "</div>";
                }
            }
            s += "</div>";
            var infobox = new google.maps.InfoWindow({
                content: s,
                maxWidth: 400
            });
            marker.addListener('click', function () {
                this.removeInfoboxes();
                infobox.open(this.map, marker);
            }.bind(this));
            // save marker to array so we can remove them all later
            this.markers.push(marker);
            // save infobox to array
            this.infoboxes.push(infobox);
        }
    },

    removeMarkers: function () {
        // remove all markers from map
        if (this.markers) {
            for (let marker of this.markers) {
                marker.setMap(null);
            }
        }
        this.markers = [];
    },

    removeInfoboxes: function () {
        if (this.infoboxes) {
            for (let infobox of this.infoboxes) {
                infobox.close();
            }
        }
        this.infoboxes = [];
    },

    centerOnMarkers: function () {
        let bounds = new google.maps.LatLngBounds();
        for (let marker of this.markers) {
            let latlng = marker.position;
            bounds.extend(latlng);
        }
        this.map.fitBounds(bounds);
        if (this.markers.length <= 1)
            this.map.setZoom(5);
    },

    drawMap: function () {
        // append each artwork to a hash of its location, then render those locations,
        // including an info window with all artwork images there.

        // remove any existing markers and infoboxes from map
        this.removeMarkers();
        this.removeInfoboxes();

        // go through selected artworks and add them to a location hash
        // basically inverting the hash of artworks to a hash of locations
        let artworks = this.props.artworks;

        let locations = {};
        for (let artwork of artworks) {
            let location_id = artwork.location_id;
            // add artwork to hash of locations
            if (!locations[location_id]) {
                var location = {};
                location.location_id = location_id;
                location.name = artwork.name;
                location.city = artwork.city;
                location.lat = artwork.lat;
                location.lng = artwork.lng;
                location.artworks = [];
                locations[location_id] = location;
            }
            // add this artwork to the location
            locations[location_id].artworks.push(artwork);
        }

        // now go through locations and add them to the map,
        let location_ids = Object.keys(locations);
        for (let location_id of location_ids) {
            let location = locations[location_id];
            this.addMarker(location);
        }

        // just show the selected markers
        this.centerOnMarkers();

    },

    render: function () {
        if (this.map) this.drawMap();
        return null; // don't render anything
    },

    componentDidUpdate: function () {
        this.drawMap();
    }

});

export default Map;
