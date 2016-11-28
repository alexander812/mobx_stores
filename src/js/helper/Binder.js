import _ from "lodash";
import {getNestedObject} from "helper/util";
import {observe, toJS} from "mobx";
import {ON_BIND_EVENT, ON_UNBIND_EVENT} from "constants/common";

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

    /**
     * Проверяет привязан ли стор к биндеру
     * @public
     * @param {string} storeName
     * @returns {*|boolean}
     */
    isStore(storeName = ''){
        var s = this.stores[storeName];
        return s && s.active;
    }

    /**
     * Привязывает стор к биндеру
     * @public
     * @param {object} store
     * @param {object} bindData
     */
    bind(store, bindData){

        var bindAs = store.bindAs;
        var otherStoreSettings;
        var storeSettings = this.stores[store.bindAs];

        this.unbind(bindAs);

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

                //return in some reserved names uses, like bind handlers
                if(varName === ON_BIND_EVENT || varName === ON_UNBIND_EVENT){
                    return;
                }

                this._addObserve(otherStoreSettings, storeSettings, varName);
            });
        });

        //notify bind stores that required store bind;
        this._notifyStores(bindAs, this._getBindStores(bindAs), ON_BIND_EVENT);

        //export vars to other store
        _.forEach(storeSettings.exportVars, (varSettings, varName)=>{
            var done = {};
            if(varSettings.storeNames.length){

                varSettings.storeNames.forEach((stroreName)=>{

                    if(this.stores[stroreName].active && !done[varName]){
                        this._addObserveDo(storeSettings, varName);
                        done[varName] = 1;
                    }
                });
            }
        });
    }

    /**
     * Отдаёт значение переменной из стора, привязанного к биндеру
     * @public
     * @param {string} storeName
     * @param {string} varName
     * @returns {mixed}
     */
    get(storeName, varName){
        var s = this.stores[storeName];
        if(s && s.active){
            return toJS(s.store[varName]);
        }
    }

    /**
     * Вызвает экшн стора с параметрами
     * @public
     * @param {string} storeName
     * @param {string} actionName
     * @param {array} arg
     */
    act(storeName, actionName, ...arg){

        var s = this.stores[storeName];
        if(s && s.active){
            s.store[actionName].apply(s.store, arg);
        }
    }

    /**
     * Отвязывает стор от биндера
     * @public
     * @param {object} store
     */
    unbind(store){
        if(!store || typeof store.bindAs !== 'string'){
            return false;
        }

        var bindAs = store.bindAs;
        var s = this.stores[bindAs];
        var eventHandlers = this._getBindStores(bindAs);

        if(s.active){
            _.forEach(s.exportVars, (varSettings)=>{
                varSettings.disposer && varSettings.disposer();
            });

            //s.exportVars = {};

            s.active = false;
            s.store = null;
            s.bindData = null;

            this._notifyStores(bindAs, eventHandlers, ON_UNBIND_EVENT);

        }
    }

    _getBindStores(storeName){

        var storeSettings = this.stores[storeName];
        var bindStoreHash = {};

        if(storeSettings){
            _.forEach(storeSettings.exportVars, (varSettings)=>{
                varSettings.storeNames.forEach((storeName)=>{
                    bindStoreHash[storeName] = 1;
                });
            });
        }
        return _.keys(bindStoreHash);
    }

    _addObserve(otherStoreSettings, storeSettings, varName){

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

            this._addObserveDo(otherStoreSettings, varName);
        }
    }

    _addObserveDo(otherStoreSettings, varName){

        var handlers = [];
        var varSettings = otherStoreSettings.exportVars[varName];
        
        if(varSettings.disposer){
            varSettings.disposer();
        }

        handlers = this._getHandlers(otherStoreSettings, varName);
        this._setByHandlers(handlers, otherStoreSettings.store, varName);

        varSettings.disposer = observe(otherStoreSettings.store, varName, () => {
            this._setByHandlers(handlers, otherStoreSettings.store, varName);
        });
    }

    _getHandlers(otherStoreSettings, varName){
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

    _setByHandlers(handlers, otherStore, varName){

        var v = toJS(otherStore[varName]);

        handlers.forEach((item)=>{

            if(typeof item.handler === 'function'){
                item.handler.call(item.store, v);
            } else {
                item.store[item.handler] = v;
            }
        });
    }

    _notifyStores(bindAs, handlers, eventName){
        handlers.forEach((bindStoreName)=>{
            var bindStoreSettings = this.stores[bindStoreName];
            var handler = getNestedObject(bindStoreSettings, 'bindData', bindAs,  eventName);
            if(typeof handler === 'function'){
                handler();
            }
        })
    }
}

export default Binder;