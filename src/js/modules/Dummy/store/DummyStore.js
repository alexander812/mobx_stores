import { observable, action, computed, autorun, extendObservable, observe, toJS } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';
import {ON_BIND_EVENT, ON_UNBIND_EVENT} from "constants/common";


class DummyStore extends BaseStore{

    bindAs = 'Dummy';

    @observable question;
    @observable questionAsked;
    @observable sum = 0;

    
    constructor(){
        super();

        this.addObserve(
            observe(this, 'question', (newValue, oldValue) => {
               // console.log('DummyStore, question =', toJS(this.question));
            })
        );

        
        
        
        this.bind({
            Survey:{
                [ON_BIND_EVENT]:()=>{
                    console.log(['DummyStore:'+ON_BIND_EVENT, this]);
                },
                [ON_UNBIND_EVENT]:()=>{
                    console.log(['DummyStore:'+ON_UNBIND_EVENT, this]);
                },
                question:'question',
                questionAsked:'questionAsked'
            }
        });











        
    }
}


export default DummyStore