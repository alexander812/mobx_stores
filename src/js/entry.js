import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';

document.addEventListener("DOMContentLoaded", function() {
    ReactDom.render(React.createElement(Platform), document.querySelector('#app-container'));
});
