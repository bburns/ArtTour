
import React from 'react';
import Select from 'react-select';
import $ from 'jquery';


// note: athenaeum has ~10k artists
var MenuFilterArtist = React.createClass({

    propTypes: {
        artist: React.PropTypes.string,
        // onSearchSubmit: React.PropTypes.func.isRequired,
        onFilterArtist: React.PropTypes.func.isRequired,
    },

    // find an artistid given a full name
    _findArtistFirstLast: function (firstlast) {
        var options = this.state.options;
        for (let option of options) {
            if (firstlast == option.firstlast)
                return option.value;
        };
        return null;
    },

    // find an artistid given a full name
    _findArtistLastFirst: function (lastfirst) {
        var options = this.state.options;
        for (let option of options) {
            if (lastfirst == option.label)
                return option.value;
        };
        return null;
    },

    getInitialState: function () {

        $.ajax({
            url: 'artists', // our api endpoint
            // data: params, // pass in data in form of ?artist=inness
            dataType: 'json',
            cache: false,
            success: function (json) {
                var state = {};
                var artists = json;

                // note: react-select component takes a list of items, like
                // var options = [
                //     { value: '1', label: 'Edward Burne-Jones' },
                //     { value: '2', label: 'Henry Fuseli' },
                // ];
                // note: we add in firstlast also
                var options = Object.keys(artists).map(function (key) {
                    let artist = artists[key];
                    // var lastname = artists[k].last_name;
                    // var firstname = artists[k].first_name;
                    // return {value: k, label: lastname + ', ' + firstname, firstlast: firstname + ' ' + lastname};
                    return { value: key, label: artist.last_first };
                });
                // sort alphabetically
                //. ask server for this
                // options.sort(function (a, b) {
                //     if (a.label > b.label) {return 1;}
                //     if (a.label < b.label) {return -1;}
                //     return 0;
                // });

                state.artists = artists;
                state.options = options;
                this.setState(state);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                // this.setState(state); // just the search string
            }.bind(this)
        });

        return { options: [] }; // initially empty
    },

    updateValue: function (newValue) {
        // console.log('Artist value changed to ' + newValue); // a number
        // this.setState({selectValue: newValue});
        var artistName = null;
        if (newValue) {
            var artists = this.state.artists;
            var artist = artists[newValue];
            // var artistName = artist.first_name + ' ' + artist.last_name;
            var artistName = artist.last_first;
        }
        this.props.onFilterArtist(artistName);
    },

    click: function () {
        alert('hideit');
        $('.Select-placeholder').hide();
    },

    render: function () {
        // find artistid given a full name
        // var val = this._findArtistFirstLast(this.props.artist);
        var val = this._findArtistLastFirst(this.props.artist);
        // value={this.state.selectValue}
        // options={options}
        // autofocus simpleValue clearable searchable

        // <span className="search-label">Artist</span>
        // id="artistSelect"
        return (
            <div id="menu-filter-artist">

                <div className="search-label">Artist</div>

                <Select
                    ref="artistSelect"
                    name="selected-artist"
                    options={this.state.options}
                    placeholder="(Select artist)"
                    value={val}
                    onClick={this.click}
                    onChange={this.updateValue}
                    disabled={false}
                    simpleValue clearable searchable
                />

            </div>
        );
    },

    componentDidMount: function () {
        // hide the "Select or enter a name" label when user clicks on control
        //. will need to distinguish this control from others on page though
        // $('.Select').on('click', function() {
        // // $('#artistSelect').on('click', function() {
        //     $('.Select-placeholder').hide();
        // });
    }

});


export default MenuFilterArtist;
