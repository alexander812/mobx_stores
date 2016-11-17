import { observable, action, computed, autorun, extendObservable } from 'mobx';
import { mix } from 'util/util';


var actions = {
    @action changeSum (sum) {
        this.winperc = 50;

        setTimeout(()=>{
            this.sum = sum;
        }, 2000);

    }
};

class SocketModel{
    @observable result = 0;

    constructor(){

        this.result = 1000;

        setTimeout(function(){
            this.result = 111;
            //console.log(['setTimeout']);
        }.bind(this), 1000);

    }

}


class PlatformStore{
    @observable sum = 0;
    @observable winperc = 80;
    @observable socketResult = null;
    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }
    constructor(){
        
        this.sum = 1000;

        mix(this, actions);
        this.socketResult = new SocketModel();
    }

}





export default PlatformStore