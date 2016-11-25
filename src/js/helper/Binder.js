import _ from "lodash";
import {getNestedObject} from "helper/util";
import {observe, toJS} from "mobx";

class Binder{
    stores ={};

    initialize(){

        _.forEach(this.stores, (store, storeName)=>{
            Object.assign(store,
                {
                    exportVars:{},
                    //linkedStores:[],
                    store:null,
                    bindAs:'',
                    bindData:null,
                    //disposers:{},
                    active: false

                },
                {bindAs:storeName});
        });

    }

    getHandlers(otherStoreSettings, varName){
        var storeNames = otherStoreSettings.exportVars[varName].storeNames;
        var handlers = [];
        
        storeNames.forEach((storeName)=>{

            var handler = getNestedObject(this.stores, storeName, 'bindData', otherStoreSettings.bindAs,  varName);
            var storeSettings = this.stores[storeName];
            if(!storeSettings.active){
                return;
            }

            if(typeof handler !== 'undefined'){
                handlers.push({
                    store:storeSettings.store,
                    handler
                })
            }
        });

        return handlers;
    }
    setByHandlers(handlers, otherStore, varName){

        var v = toJS(otherStore[varName]);

        handlers.forEach((item)=>{

            if(typeof item.handler === 'function'){
                item.handler.call(item.store, v);
            } else {
                item.store[item.handler] = v;
            }
        });
    }

    addObserve(otherStoreSettings, storeSettings, varName){

        var flag = false;
        var handlers = [];
        var storeName = storeSettings.bindAs;
        var varSettings = otherStoreSettings.exportVars[varName];

        if(!varSettings){

            otherStoreSettings.exportVars[varName] = {
                storeNames: [],
                disposer  : null
            };
            varSettings = otherStoreSettings.exportVars[varName];
        }

        if(!_.includes( varSettings.storeNames, storeName)){
            varSettings.storeNames.push(storeName);
            flag = true;
        }

        if(flag && otherStoreSettings.active){
            if(varSettings.disposer){
                varSettings.disposer();
            }

            handlers = this.getHandlers(otherStoreSettings, varName);

            //console.log(['handlers', handlers]);

            this.setByHandlers(handlers, otherStoreSettings.store, varName);

            varSettings.disposer = observe(otherStoreSettings.store, varName, () => {
                this.setByHandlers(handlers, otherStoreSettings.store, varName);
            });
        }
    }
    
    bind(store, bindData){

        var bindAs = store.bindAs;
        console.log(['bindAs', bindAs]);
        var otherStoreSettings;
        var storeSettings = this.stores[store.bindAs];

        if(!storeSettings){
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(store).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
            return false;
        }

        storeSettings.store = store;
        storeSettings.bindData = bindData;
        storeSettings.active = true;

        _.forEach(bindData, (vars, otherStoreSettingsName)=>{

            otherStoreSettings = this.stores[otherStoreSettingsName];

            if(!otherStoreSettings){
                //error
                return;
            }
            _.forEach(vars, (handler, varName)=>{

                this.addObserve(otherStoreSettings, storeSettings, varName);

            });
        });

/*
        if(settings.linkedStores.length){

            //console.log(['bindAs', bindAs, settings]);

        }
*/
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