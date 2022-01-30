// render the client application

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('load-icon').style.display = 'none';
    ReactDOM.render(<App />, document.getElementById('app'));
});
