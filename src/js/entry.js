import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';
import Survey from 'modules/Survey/Survey';
import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';




document.addEventListener("DOMContentLoaded", function() {


    //ReactDom.render(React.createElement(Platform), document.querySelector('#platform-container'));
    ReactDom.render(React.createElement(Survey), document.querySelector('#survey-container'));



    /*
    document.querySelector('#action-mount').onclick = function(){
        ReactDom.render(React.createElement(Platform), document.querySelector('#app-container'));
    };

    document.querySelector('#action-unmount').onclick = function(){
        ReactDom.unmountComponentAtNode(document.querySelector('#app-container'))
    };
*/

    
    

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
