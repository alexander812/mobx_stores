import { observable, action, computed } from 'mobx';
import { mix } from 'util/utils';


var actions = {
    @action changeSum (sum) {
        this.winperc = 50;

        setTimeout(()=>{
            this.sum = sum;
        }, 2000);

    }
};




class PlatformStore{
    @observable sum = 0;
    @observable winperc = 80;
    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }

    constructor(){
        
        this.sum = 1000;

        mix(this, actions);
    }

}





export default PlatformStore