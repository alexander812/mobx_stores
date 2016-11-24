import _ from "lodash";
import {getNestedObject} from "helper/util";
import {observe, toJS} from "mobx";

class Binder{
    stores ={};

    initialize(){

        _.forEach(this.stores, (store, storeName)=>{
            Object.assign(store,
                {
                    linkedStores:[],
                    store:null,
                    bindAs:'',
                    bindData:null,
                    disposers:{},
                    active: false
                },
                {bindAs:storeName});
        });

    }


    bind(store, bindData){

        var v = {v1:{v2:{v3:null}}};

        var bindAs = store.bindAs;
        console.log(['bindAs', bindAs]);
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

            this.processObserve(otherStoreName, bindAs);
        });

        if(settings.linkedStores.length){
            /////
            //console.log(['bindAs', bindAs, settings]);

        }

    }

    processObserve(storeName, attachedStoreName){

        console.log(['processObserve', storeName, attachedStoreName]);

        var settings = this.stores[storeName];
        var settingsAttachedStore = this.stores[attachedStoreName];
        var handlers = {};
        if(!settings){
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(store).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
            return false;
        }

        if(!settings.active){
            return false;
        }
        
        settings.linkedStores.forEach((linkedStoreName)=>{

            var bindVars, linkedStoreSettings = this.stores[linkedStoreName];

            if(!linkedStoreSettings || !linkedStoreSettings.active){
                return false;
            }

            bindVars = linkedStoreSettings.bindData[storeName];
            if(!bindVars){
                return false;
            }

            _.forEach(bindVars, (handler, varName)=>{

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


        if(handlers){
            _.forEach(handlers, (handlerArr, varName)=>{

                if(getNestedObject(settingsAttachedStore, 'bindData', storeName, varName)){

                    var disposer = getNestedObject(settings, 'disposers', varName);
                    if(disposer){
                        disposer();
                    }

                    /*

                    var v = toJS(settings.store[varName]);

                    handlerArr.forEach((item)=>{

                        if(typeof item.handler === 'function'){
                            item.handler.call(item.store, v);
                        } else {
                            item.store[item.handler] = v;
                        }

                    });
                    */

                    settings.disposers[varName] = observe(settings.store, varName, () => {

                        var v = toJS(settings.store[varName]);

                        handlerArr.forEach((item)=>{

                            if(typeof item.handler === 'function'){
                                item.handler.call(item.store, v);
                            } else {
                                item.store[item.handler] = v;
                            }

                        });
                    });


                    console.log(['handlerArr', handlerArr]);




                }

            });
        }



    }


    unbind(module){
        if(module.bindAs && this.modules[module.bindAs]){
            delete this.modules[module.bindAs];
        }
    }
}

export default Binder;