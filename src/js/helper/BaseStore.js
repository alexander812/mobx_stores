import globalStore from 'stores/GlobalStore';

class BaseStore{

    constructor(){
        if(this.bindAs && typeof this.bindAs === 'string'){
            globalStore.bind(this);
        }
    }

    disposers = [];

    addObserve(obsr){
        this.disposers.push(obsr);
    }

    destroy(){

        this.disposers.forEach((obsr)=>{
            obsr();
        });

        if(this.bindAs && typeof this.bindAs === 'string'){
            globalStore.unbind(this);
        }

    }
}

export default BaseStore;