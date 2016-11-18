class BaseStore{

    disposers = [];

    addObserve(obsr){
        this.disposers.push(obsr);
    }

    destroy(){

        this.disposers.forEach((obsr)=>{
            obsr();
        });

    }
}

export default BaseStore;