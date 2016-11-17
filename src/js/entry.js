import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';
import PlatformConnector from 'modules/Platforfm/PlatformConnector';

document.addEventListener("DOMContentLoaded", function() {

    //console.log(['PlatformConnector', PlatformConnector, Platform]);

    ReactDom.render(React.createElement(PlatformConnector), document.querySelector('#app-container'));
});
