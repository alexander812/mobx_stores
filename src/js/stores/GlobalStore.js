import { observable, action, computed, autorun } from 'mobx';
import { mix } from 'util/util';

class GlobalStore{

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

}


var globalStore = new GlobalStore();



export default globalStore;