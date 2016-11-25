import _ from "lodash";
import {getNestedObject} from "helper/util";
import {observe, toJS} from "mobx";

const ON_BIND_EVENT = 'onBind';
const ON_UNBIND_EVENT = 'onUnbind';

class Binder{
    stores ={};

    initialize(){

        _.forEach(this.stores, (store, storeName)=>{
            Object.assign(store,
                {
                    exportVars:{},
                    store:null,
                    bindAs:'',
                    bindData:null,
                    active: false
                },
                {bindAs:storeName});
        });

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

        //import vars from other stores
        _.forEach(bindData, (vars, otherStoreSettingsName)=>{

            otherStoreSettings = this.stores[otherStoreSettingsName];

            if(!otherStoreSettings){
                //error
                return;
            }
            _.forEach(vars, (handler, varName)=>{

                //trigger 'onBind' action
                if(varName === ON_BIND_EVENT || varName === ON_UNBIND_EVENT){
                    if(varName === 'onBind' && typeof handler === 'function' && otherStoreSettings.active){
                        handler.call(store, 'wasBind');
                    }
                    return;
                }

                this.addObserve(otherStoreSettings, storeSettings, varName);
            });
        });

        //export vars to other store
        _.forEach(storeSettings.exportVars, (varSettings, varName)=>{
            var done = {};
            if(varSettings.storeNames.length){

                varSettings.storeNames.forEach((stroreName)=>{

                    if(this.stores[stroreName].active && !done[varName]){
                        this.addObserveDo(storeSettings, varName);
                        done[varName] = 1;
                    }
                });
            }
        });

    }

    addObserve(otherStoreSettings, storeSettings, varName){

        var flag = false;

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

            this.addObserveDo(otherStoreSettings, varName);
        }
    }

    addObserveDo(otherStoreSettings, varName){

        var handlers = [];
        var varSettings = otherStoreSettings.exportVars[varName];
        
        if(varSettings.disposer){
            varSettings.disposer();
        }

        handlers = this.getHandlers(otherStoreSettings, varName);
        this.setByHandlers(handlers, otherStoreSettings.store, varName);

        varSettings.disposer = observe(otherStoreSettings.store, varName, () => {
            this.setByHandlers(handlers, otherStoreSettings.store, varName);
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

    unbind(module){
        if(module.bindAs && this.modules[module.bindAs]){
            delete this.modules[module.bindAs];
        }
    }
}

export default Binder;