import ReactDom from 'react-dom';
import React from 'react';
import Platform from 'modules/Platforfm/Platform';
import Survey from 'modules/Survey/Survey';
import DummyStore from 'modules/Dummy/store/DummyStore';
import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import {checkNestedObject} from "helper/util";


document.addEventListener("DOMContentLoaded", function() {

    var dummyStore = new DummyStore();



    ReactDom.render(React.createElement(Survey), document.querySelector('#survey-container'));
    ReactDom.render(React.createElement(Platform), document.querySelector('#platform-container'));

    var tm = 1482166372;
    var nowRounded = roundSec(tm);
    var firstMin = nowRounded + 120;
    var minsEndMoment = firstMin + (5 * 60);


    findNext15(1482166740-(60*59-(46*60)));


    function findNext15(ts){
        var d = new Date(ts * 1000);
        var min = d.getMinutes();
        var roundedTs = Math.floor((d.setMinutes(0) && d.setSeconds(0))/1000);
        return roundedTs + ((Math.floor(min / 15) * 15) + 15) * 60;
    }
    function roundSec(ts){
        var d = new Date(ts*1000);
        return  Math.floor(d.setSeconds(0) / 1000);
    }


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
