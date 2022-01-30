
import React from 'react';
import Select from 'react-select';


var MenuFilterCountry = React.createClass({

    propTypes: {
        // artist: React.PropTypes.string,
        // onSearchSubmit: React.PropTypes.func.isRequired,
        onFilterCountry: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        // list of countries
        var countries = [
            { value: 'austria', label: 'Austria' },
            { value: 'canada', label: 'Canada' },
            { value: 'england', label: 'England' },
            { value: 'germany', label: 'Germany' },
            { value: 'italy', label: 'Italy' },
            { value: 'poland', label: 'Poland' },
            { value: 'united_states', label: 'United States' },
        ];
        var state = {};
        state.options = countries;
        return state;
    },

    // find a countryid given its name
    _findCountryId: function (country) {
        var options = this.state.options;
        for (let option of options) {
            if (country == option.label)
                return option.value;
        };
        return null;
    },

    // find a country name given its id
    _findCountryName: function (countryid) {
        var options = this.state.options;
        for (let option of options) {
            if (countryid == option.value)
                return option.label;
        };
        return null;
    },

    _updateValue: function (newValue) {
        console.log('Country value changed to ' + newValue); // a number
        var countryid = newValue;
        var country = this._findCountryName(countryid);
        this.props.onFilterCountry(country);
    },

    render: function () {
        // find countryid given a name
        var val = this._findCountryId(this.props.country);

        return (
            <div id="menu-filter-country">

                <div className="search-label">Country</div>

                <Select
                    ref="countrySelect"
                    name="selected-country"
                    options={this.state.options}
                    placeholder="(Select country)"
                    value={val}
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


export default MenuFilterCountry;
