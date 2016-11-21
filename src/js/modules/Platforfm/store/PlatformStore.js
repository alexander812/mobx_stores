import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';



class PlatformStore extends BaseStore{



    bindAs = 'Platform';
    testArr = [];
    @observable sum = 0;
    @observable winperc = 80;

    @observable serverTime = 12121212;


    @observable questions = [
        {
            id:1,
            text:'Are you ready?',
            selected:true,
            result:false
        },
        {
            id:2,
            text:'Make sense?',
            result:false
        }
    ];





    /*
    @computed get serverTime() {

        //console.log(['computed get serverTime', globalStore.serverTime]);

        return globalStore.serverTime;
    }
*/

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
        var t0 = performance.now();
        this.iter = 0;

        var dd = setInterval(()=>{

            this.serverTime = this.iter;
            this.iter++;

            if( this.iter == 1000){
                console.log("Call to doSomething took " + (performance.now() - t0) + " milliseconds.")
                clearInterval(dd);
            }

        }, 1);


*/



        /*
        var len = 100000;
        this.testArr = new Array(len);
        for(var i = 0; i < len; i ++){
            this.testArr[i]  = new Date().toString()+i;
        }
        */

    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore