import { observable, action, computed, autorun, extendObservable } from 'mobx';
import { mix } from 'util/util';
import platformActions  from 'modules/Platforfm/action/platformActions';



class PlatformStore{
    @observable sum = 0;
    @observable winperc = 80;
    @observable dealType = 'turbo';

    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }
    constructor(){
        this.sum = 1000;

    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore