import React from 'react';
import {observer, Provider} from 'mobx-react'

function Connector(Component, stores, options) {



    /*
    @observer class Wrapper2 extends React.Component{

        static contextTypes = {
            store: React.PropTypes.object
        };

        render(){

            console.log(['Wrapper2', this.props, this]);

            return  <Component
                sum={this.props.store.sum}
                earn={this.props.store.earn}

            />
        }
    }
    */


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
            return typeof store === 'function' ? store.call(this) : store;
        }

        resolveStores(stores){
            var key;
            var resolved;

            for (key in stores) {
                if (!stores.hasOwnProperty(key)) continue;
                resolved = this.resolveStore(stores[key]);
                this.storesResolvedArr.push(resolved);
                this.storesResolved[key] = resolved;
            }
        }
    
        componentWillMount(){
            this.options = options;
            this.storesResolvedArr = [];
            this.storesResolved = {};
            this.resolveStores(stores);
            this.store = this.storesResolved.store;

        }

        composeProps(){
            var helper = typeof options === 'function' || options.helper;

            if(helper){
                return options.helper.apply(this, this.storesResolvedArr);
            } else {

                return this.storesResolved;
            }


        }

        render(){

            var props = this.composeProps();


            console.log(['Wrapper', props]);
            
            
/*

 //serverTime={this.stores.globalStore.serverTime}
 */

            return  <Component
            sum={this.store.sum}
            earn={this.store.earn}


            />
        }
    }


    return Wrapper

}

export default Connector;





