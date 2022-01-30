
import React from 'react';


var MenuFilterFavorites = React.createClass({
    render: function () {
        return (
            <div id="menu-filter-favorites">

                <div>
                    Favorites
                </div>

                <label>
                    <input type="checkbox" onChange={this.props.onFilterFavorites} />
                    Show favorites only
                </label>

            </div>
        );
    }
});


export default MenuFilterFavorites;
