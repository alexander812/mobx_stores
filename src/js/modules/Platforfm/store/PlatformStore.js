import { observable, action, computed, autorun, extendObservable, observe, toJS } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';



class PlatformStore extends BaseStore{

    bindAs = 'Platform';

    @observable question;
    @observable sum = 0;
    @observable winperc = 80;

    @computed get serverTime() {
        return globalStore.serverTime;
    }

    @computed get earn() {
        return Math.floor(this.sum / 100 * this.winperc);
    }
    
    constructor(){
        super();

        this.bind({
            Survey:{
                question:function(value){
                    console.log(['value', value]);
                }
            }
        });


        this.sum = 1000;

        this.addObserve(
            observe(this, 'question', (newValue, oldValue) => {
                console.log('change question', toJS(this.question));
            })
        );

    }

}


mix( PlatformStore.prototype, platformActions );



export default PlatformStore