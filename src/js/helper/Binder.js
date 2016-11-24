import _ from "lodash";
import {observe, toJS} from "mobx";

class Binder{
    stores ={};
    storeExample = {
        linkedStores:[],
        store:null,
        bindAs:'',
        bindData:null,
        disposers:{},
        active: false
    };

    initialize(){

        _.forEach(this.stores, (store)=>{
            Object.assign(store, this.storeExample);
        });
    }


    bind(store, bindData){
        var bindAs = store.bindAs;
        var otherStore;
        var settings = this.stores[store.bindAs];

        if(!settings){
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(store).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
            return false;
        }

        settings.store = store;
        settings.bindData = bindData;
        settings.active = true;

        _.forEach(bindData, (vars, otherStoreName)=>{

            otherStore = this.stores[otherStoreName];
            if(!otherStore){
                //error
                return;
            }

            if(!_.includes( otherStore.linkedStores, bindAs)){
                otherStore.linkedStores.push(bindAs);
            }

            this.processObserve(otherStoreName);
        });

    }

    processObserve(storeName){

        var settings = this.stores[storeName];
        var handlers = {};

        if(!settings){
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(store).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
            return false;
        }

        settings.linkedStores.forEach((linkedStoreName)=>{

            var bindedVars, linkedStoreSettings = this.stores[linkedStoreName];

            if(!linkedStoreSettings || !linkedStoreSettings.active){
                return false;
            }

            bindedVars = linkedStoreSettings.bindData[storeName];
            if(!bindedVars){
                return false;
            }

            _.forEach(bindedVars, (handler, varName)=>{

                var o = {
                    handler,
                    store:linkedStoreSettings.store
                };

                if(!handlers[varName]){
                    handlers[varName] = [o]
                } else {
                    handlers[varName].push(o);
                }


            });


        });


        console.log(['handlers', handlers]);




    }


    unbind(module){
        if(module.bindAs && this.modules[module.bindAs]){
            delete this.modules[module.bindAs];
        }
    }
}

export default Binder;