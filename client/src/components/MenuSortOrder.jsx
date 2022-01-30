
import React from 'react';
import Select from 'react-select';


var MenuSortOrder = React.createClass({

    propTypes: {
        onChangeSortOrder: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        // note: react-select component takes a list of items, like
        // var options = [
        //     { value: '1', label: 'Edward Burne-Jones' },
        //     { value: '2', label: 'Henry Fuseli' },
        // ];
        var options = [
            { value: 'random', label: 'Random' },
            // { value: 'title', label: 'Title'},
            { value: 'artist', label: 'Artist' },
            { value: 'oldest_first', label: 'Oldest first' },
            { value: 'newest_first', label: 'Newest first' },
            { value: 'oldest_first_db', label: 'Oldest in database first' },
            { value: 'newest_first_db', label: 'Newest in database first' },
        ];
        var value = 'random';
        return { options, value };
    },

    _onChange: function (newValue) {
        this.setState({ value: newValue });
        this.props.onChangeSortOrder(newValue);
    },

    render: function () {
        // <div className="search-label">Artist</div>
        // var val = '0';
        var val = this.state.value;
        // onClick={this.click}
        // onChange={this.updateValue}
        return (
            <div id="menu-sort-order">

                <div>
                    Sort
                </div>

                <Select
                    ref="sortOrder"
                    name="sort-order"
                    options={this.state.options}
                    onChange={this._onChange}
                    placeholder="Select a sort order"
                    value={val}
                    disabled={false}
                    simpleValue
                    clearable={false}
                    searchable={false}
                />

            </div>
        );
    }
});


export default MenuSortOrder;
