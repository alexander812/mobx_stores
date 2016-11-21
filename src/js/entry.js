import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';
import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';


import PlatformConnector from 'modules/Platforfm/PlatformConnector';

document.addEventListener("DOMContentLoaded", function() {


    ReactDom.render(React.createElement(PlatformConnector), document.querySelector('#app-container'));


    document.querySelector('#action-mount').onclick = function(){
        ReactDom.render(React.createElement(PlatformConnector), document.querySelector('#app-container'));
    };

    document.querySelector('#action-unmount').onclick = function(){
        ReactDom.unmountComponentAtNode(document.querySelector('#app-container'))
    };


    
    

    /*


    class SomeStore{
        @observable sum = 100;
        @observable sumPrev = 100;

        @computed get diff() {
            return this.sum - this.sumPrev;
        }

        constructor(){
            observe(this, "sum", (newValue, oldValue) => {
                this.sumPrev = oldValue;
            });
        }
    }

    new SomeStore();

*/


});
