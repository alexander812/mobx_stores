import { observable, action, computed, autorun } from 'mobx';
import { mix } from 'helper/util';

class GlobalStore{



    modules = {};
    userId = null;
    userName = null;
    @observable serverTime = new Date().getTime();

    constructor(){

        this.userId = 2;
        this.userName = 'alex';

        window.setInterval(()=>{
            this.serverTime = new Date().getTime();
        }, 1000);

    }

    bind(module){
        if(module.bindAs && typeof module.bindAs === 'string'){
            modules[module.bindAs] = module;
        }
    }

    unbind(module){
        if(module.bindAs && this.modules[module.bindAs]){
            delete this.modules[module.bindAs];
        }
    }

}


var globalStore = new GlobalStore();



export default globalStore;