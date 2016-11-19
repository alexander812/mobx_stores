import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';



class PlatformStore extends BaseStore{
    @observable sum = 0;
    @observable winperc = 80;
    @observable hello = {
        v1:1,
        v2:3
    };


    @computed get serverTime() {
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


    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore