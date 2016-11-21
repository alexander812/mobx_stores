import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import { mix } from 'helper/util';
import surveyActions  from 'modules/Survey/action/surveyActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';





class SurveyStore extends BaseStore{



    bindAs = 'Survey';
    testArr = [];
    @observable sum = 0;
    @observable winperc = 80;

    @computed get serverTime() {

        //console.log(['computed get serverTime', globalStore.serverTime]);

        return globalStore.serverTime;
    }

    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }
    
    constructor(){
        super();

        this.sum = 1000;

        this.addObserve(
            observe(this, 'serverTime', (newValue, oldValue) => {
                //console.log('change', newValue, oldValue);
            })
        );


        /*
        var len = 100000;
        this.testArr = new Array(len);
        for(var i = 0; i < len; i ++){
            this.testArr[i]  = new Date().toString()+i;
        }
        */

    }

}


mix( SurveyStore.prototype, surveyActions );



export default SurveyStore