import globalStore from 'stores/GlobalStore';

class BaseStore{

    disposers = [];

    addObserve(obsr){
        this.disposers.push(obsr);
    }

    bind(bindData){

        if(typeof this.bindAs === 'string'){
            globalStore.binder.bind(this, bindData);
        } else {
            console.error(`Unknown bindAs for ${Object.getPrototypeOf(module).constructor.name}`);
        }
    }
    unbind(){
        if(this.bindAs && typeof this.bindAs === 'string'){
            globalStore.binder.unbind(this);
        }
    }
    destroy(){

        this.disposers.forEach((obsr)=>{
            obsr();
        });

        this.unbind();

    }
}

export default BaseStore;