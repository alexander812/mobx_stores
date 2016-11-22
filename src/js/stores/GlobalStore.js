import { observable, action, computed, autorun } from 'mobx';
import { mix } from 'helper/util';
import GlobalBinder from 'stores/GlobalBinder';

class GlobalStore{



    
    userId = null;
    userName = null;
    binder = new GlobalBinder();
    @observable serverTime = new Date().getTime();

    constructor(){

        this.userId = 2;
        this.userName = 'alex';

        window.setInterval(()=>{
            this.serverTime = new Date().getTime();
        }, 1000);

    }



}


var globalStore = new GlobalStore();



export default globalStore;