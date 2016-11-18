import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';
import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';


import PlatformConnector from 'modules/Platforfm/PlatformConnector';

document.addEventListener("DOMContentLoaded", function() {

    //console.log(['PlatformConnector', PlatformConnector, Platform]);

    ReactDom.render(React.createElement(PlatformConnector), document.querySelector('#app-container'));





    class SomeStore{
        @observable sum = 100;
        @observable sumPrev = 100;

        @computed get diff() {
            return this.sum - this.sumPrev;
        }

        constructor(){


            setTimeout(()=>{
                this.sum = 200;
            }, 1000);



            const disposer = observe(this, "sum", (newValue, oldValue) => {
                this.sumPrev = oldValue;
            });






            autorun(()=>{
                console.log(['diff=', this.diff]);
            });



        }

    }





    new SomeStore();




});
