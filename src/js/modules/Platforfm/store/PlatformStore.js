import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';



class PlatformStore{
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
        this.sum = 1000;
        
        const disposer = observe(this, (change) => {
            console.log('change', change);
        });

        
    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore