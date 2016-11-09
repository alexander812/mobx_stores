import ReactDom from 'react-dom';
import React from 'react';
import Dummy from 'components/Dummy';

document.addEventListener("DOMContentLoaded", function() {
    ReactDom.render(React.createElement(Dummy), document.querySelector('#app-container'));
});