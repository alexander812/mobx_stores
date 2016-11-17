import { observable, action, computed, autorun, extendObservable } from 'mobx';
import { mix } from 'util/util';
import platformActions  from 'modules/Platforfm/action/platformActions';


console.log(['platformActions', platformActions]);


class PlatformStore{
    @observable sum = 0;
    @observable winperc = 80;
    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }
    constructor(){
        
        this.sum = 1000;


        console.log(['PlatformStore', this]);
        
        

    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore