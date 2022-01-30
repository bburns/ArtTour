
import React from 'react';
import Select from 'react-select';


var MenuFilterCity = React.createClass({

    propTypes: {
        // artist: React.PropTypes.string,
        // onSearchSubmit: React.PropTypes.func.isRequired,
        onFilterCity: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        // list of countries
        //. need to get this from server when state/country/continent changes
        var cities = [
            { value: 'Berlin', label: 'Berlin' },
            { value: 'Boston', label: 'Boston' },
            { value: 'Cambridge', label: 'Cambridge' },
            { value: 'Cracow', label: 'Cracow' },
            { value: 'Detroit', label: 'Detroit' },
            { value: 'Florence', label: 'Florence' },
            { value: 'London', label: 'London' },
            { value: 'Munich', label: 'Munich' },
            { value: 'New York', label: 'New York' },
            { value: 'Newcastle Upon Tyne', label: 'Newcastle Upon Tyne' },
            { value: 'Oxfordshire', label: 'Oxfordshire' },
            { value: 'Philadelphia', label: 'Philadelphia' },
            { value: 'Southampton', label: 'Southampton' },
            { value: 'Springfield', label: 'Springfield' },
            { value: 'St Louis', label: 'St Louis' },
            { value: 'Stuttgart', label: 'Stuttgart' },
            { value: 'Vienna', label: 'Vienna' },
            { value: 'Wilmington', label: 'Wilmington' },
            { value: 'Winston-Salem', label: 'Winston-Salem' },
            { value: 'Worcester', label: 'Worcester' },
        ];
        var state = {};
        state.options = cities;
        return state;
    },

    // // find a cityid given its name
    // _findCityId: function(city) {
    //     var options = this.state.options;
    //     for (let option of options) {
    //         if (city == option.label)
    //             return option.value;
    //     };
    //     return null;
    // },

    // // find a city name given its id
    // _findCityName: function(cityid) {
    //     var options = this.state.options;
    //     for (let option of options) {
    //         if (cityid == option.value)
    //             return option.label;
    //     };
    //     return null;
    // },

    _updateValue: function (newValue) {
        console.log('City value changed to ' + newValue);
        // var cityid = newValue;
        // var city = this._findCityName(cityid);
        let city = newValue;
        this.props.onFilterCity(city);
    },

    render: function () {
        // find cityid given a name
        // var val = this._findCityId(this.props.city);

        return (
            <div id="menu-filter-city">

                <div className="search-label">City</div>

                <Select
                    ref="citySelect"
                    name="selected-city"
                    options={this.state.options}
                    placeholder="(Select city)"
                    value={this.props.city}
                    onChange={this._updateValue}
                    disabled={false}
                    simpleValue
                    clearable
                    searchable
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


export default MenuFilterCity;
