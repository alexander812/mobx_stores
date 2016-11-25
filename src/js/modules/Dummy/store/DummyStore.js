import { observable, action, computed, autorun, extendObservable, observe, toJS } from 'mobx';
import { mix } from 'helper/util';
import platformActions  from 'modules/Platforfm/action/platformActions';
import globalStore  from 'stores/GlobalStore';
import BaseStore  from 'helper/BaseStore';



class DummyStore extends BaseStore{

    bindAs = 'Dummy';

    @observable question;
    @observable questionAsked;
    @observable sum = 0;

    
    constructor(){
        super();

        this.addObserve(
            observe(this, 'question', (newValue, oldValue) => {
                console.log('DummyStore, question =', toJS(this.question));
            })
        );

        this.bind({
            Survey:{
                question:function(value){
                    console.log(['DummyStore value', value]);
                },
                questionAsked:'questionAsked'
            }
        });






        
    }
}


export default DummyStore