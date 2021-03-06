import { observable, action, computed, autorun, extendObservable, observe, toJS } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';
import {ON_BIND_EVENT, ON_UNBIND_EVENT} from "constants/common";

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


        this.addObserve(
            observe(this, 'serverTime', (newValue, oldValue) => {
                //console.log('PlatformStore serverTime', toJS(this.serverTime));
            }),
            'serverTime'
        );

        
        this.bind({
            Survey:{
                [ON_BIND_EVENT]:()=>{
                    console.log(['PlatformStore:'+ON_BIND_EVENT, this]);
                },
                [ON_UNBIND_EVENT]:()=>{
                    console.log(['PlatformStore:'+ON_UNBIND_EVENT, this]);
                },
                question:function(value){
                   // console.log(['PlatformStore value', value]);
                }
            }
        });

        


        this.sum = 1000;

    }

}

mix( PlatformStore.prototype, platformActions );

export default PlatformStore