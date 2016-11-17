import React from 'react';
import {observer, Provider} from 'mobx-react'

function Connector(Component, stores, options) {


@observer class Wrapper extends React.Component{

        static childContextTypes = {
            store:  React.PropTypes.object
        };

        getChildContext() {
            return {
                store: this.store
            };
        }

        resolveStore(store){

            var resolved = typeof store === 'function' ? store.call(this) : store;
            this.storesResolved.push(resolved);
        }

        resolveStores(stores){
            if(Array.isArray(stores)){
                stores.forEach((item)=>{
                    this.resolveStore(item);
                });
            } else {
                this.resolveStore(stores);
            }
        }
    
        componentWillMount(){
            this.options = options;
            this.storesResolved = [];
            this.resolveStores(stores);
            this.store = this.storesResolved[0];
        }

        composeProps(){
            var helper = typeof options === 'function' ? options : options.helper;

            if(helper){
                return helper.apply(this, this.storesResolved);
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





