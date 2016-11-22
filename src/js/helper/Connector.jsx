import React from 'react';
import {observer, Provider} from 'mobx-react'
import {toJS} from 'mobx'
import _  from 'lodash';

function Connector(Component, stores, options) {


@observer class Wrapper extends React.Component{

        static childContextTypes = {
            store:  React.PropTypes.object
        };

        static contextTypes = {
            store: React.PropTypes.object
        };

        getChildContext() {
            return {
                store: this.store
            };
        }

        resolveStore(store){

            var resolved = typeof store === 'function' ? store.call(this) : store;
            if(typeof store === 'function'){
                this.toDestroy.push(resolved);
            }

            this.storesResolved.push(resolved);
        }

        resolveStores(stores){
            if(Array.isArray(stores)){
                stores.forEach((item)=>{
                    this.resolveStore(item);
                });
            } else {
                this.resolveStore(stores || this.context.store);
            }
        }
    
        componentWillMount(){
            //TODO remove options, stores
            this.toDestroy = [];
            this.options = options;
            this.storesResolved = [];
            this.resolveStores(stores);
            this.store = this.storesResolved[0];
        }

        componentWillUnmount(){
            this.toDestroy.forEach((resolved)=>{
                if(resolved.destroy){
                    resolved.destroy();
                }
            });
        }

        shouldComponentUpdate(){
            return false;
        }

        composeProps(){
            var composed, result = {};
            var helper = typeof options === 'function' ? options : options.helper;

            if(helper){

                composed = helper.apply(this, this.storesResolved);

                _.forIn(composed, function(item, key) {
                    result[key] = toJS(item);
                });

                return result;
                //return composed;

            } else {
                return this.storesResolved;
            }
        }

        render(){

            var props = this.composeProps();
            return  <Component{...props}/>
        }
    }


    return Wrapper

}

export default Connector;





