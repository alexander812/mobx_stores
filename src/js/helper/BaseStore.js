import globalStore from 'stores/GlobalStore';
import {protoName} from "helper/util";


class BaseStore{

    disposers = [];
    disposerKeys = {};

    /**
     * Добавляет наблюдателя переменной, при необходимости именуется ключом
     * @public
     * @param {object} obsr
     * @param {string} key
     * @returns {*|disposer}
     */
    addObserve(obsr, key){
        this.disposers.push(obsr);
        
        if(this.disposerKeys[key]){
            console.error(`Observer with key "${key}" already exists in the store ${protoName(this)}`);
            return false;
        }

        if(key){
            this.disposerKeys[key] = this.disposers.length - 1;
        }

        return this.disposers[this.disposers.length - 1];

    }
    /**
     * Удаляет именованный ключом наблюдатель переменной
     * @public
     * @param {string} key
     */
    removeObserve(key){

        if(typeof this.disposerKeys[key] === 'undefined'){
            console.error(`Observer with key "${key}" not fount in the store ${protoName(this)}`);
            return false;
        }

        this.disposers[this.disposerKeys[key]]();
        this.disposers[this.disposerKeys[key]] = null;
        delete this.disposerKeys[key];

    }
    /**
     * Привязывает стор к глобальному биндеру
     * @public
     * @param {object} bindData
     */
    bind(bindData){

        if(typeof this.bindAs === 'string'){
            globalStore.binder.bind(this, bindData);
        } else {
            console.error(`Unknown bindAs for ${protoName(module)}`);
        }
    }
    /**
     * Отвязывает стор от глобального биндера
     * @public
     */
    unbind(){
        if(this.bindAs && typeof this.bindAs === 'string'){
            globalStore.binder.unbind(this);
        }
    }
    /**
     * Отвязывает стор от зависимостей перед удалением
     * @public
     */
    destroy(){

        this.disposers.forEach((obsr)=>{
            obsr();
        });

        this.unbind();

    }
}

export default BaseStore;