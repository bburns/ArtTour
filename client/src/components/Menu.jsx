// sidebar with search, sort, filter, options


import React from 'react';
import Select from 'react-select';

import MenuFilterArtist from './MenuFilterArtist';
import MenuFilterCity from './MenuFilterCity';
import MenuFilterCountry from './MenuFilterCountry';
import MenuFilterFavorites from './MenuFilterFavorites';
import MenuSortOrder from './MenuSortOrder';



var Menu = React.createClass({

    propTypes: {
        artist: React.PropTypes.string,
        country: React.PropTypes.string,
        onFilterArtist: React.PropTypes.func.isRequired,
        onFilterCity: React.PropTypes.func.isRequired,
        onFilterCountry: React.PropTypes.func.isRequired,
        onFilterFavorites: React.PropTypes.func.isRequired,
        onChangeSortOrder: React.PropTypes.func.isRequired,
    },

    // getInitialState: function() {
    //     return {
    //         menuOpen: true
    //         // menuOpen: false
    //     };
    // },
    // _menuOpen: function(event) {
    //     event.preventDefault();
    //     this.setState({menuOpen:true});
    // },
    // _menuClose: function(event) {
    //     event.preventDefault();
    //     this.setState({menuOpen:false});
    // },

    render: function () {
        //. hide/show main div
        // <div id="menu" style={{display:'none'}}>
        // <MenuButton menuOpen={this.props.menuOpen} />
        // <div id="menu-contents" style={{display:'none'}}>
        // </div>
        var styleContents = {
            width: this.props.menuOpen ? '15em' : '0',
            display: this.props.menuOpen ? 'block' : 'none'
        };
        // <SortOrder onSort={this.props.onSort} />
        // <SearchArtist artist={this.props.artist} onSearchSubmit={this._onSearchSubmit} />
        return (
            <div id="menu" style={styleContents}>
                <MenuFilterArtist artist={this.props.artist} onFilterArtist={this.props.onFilterArtist} />
                <MenuFilterCity city={this.props.city} onFilterCity={this.props.onFilterCity} />
                <MenuFilterCountry country={this.props.country} onFilterCountry={this.props.onFilterCountry} />
                <MenuSortOrder onChangeSortOrder={this.props.onChangeSortOrder} />
                <MenuFilterFavorites onFilterFavorites={this.props.onFilterFavorites} />
            </div>
        );
    }
});



var MenuButton = React.createClass({
    render: function () {
        var styleOpenButton = { display: this.props.menuOpen ? 'none' : 'inline-block' };
        var styleCloseButton = { display: this.props.menuOpen ? 'inline-block' : 'none' };
        return (
            <div className="menu-button-container">
                <a href="#" onClick={this._menuOpen} className="menu-button-open" style={styleOpenButton}></a>
                <a href="#" onClick={this._menuClose} className="menu-button-close" style={styleCloseButton}></a>
            </div>
        );
    }
});


export default Menu;
