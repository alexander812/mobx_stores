import React from 'react';
import {observer, Provider} from 'mobx-react'

function Connector(Component, stores, options) {



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


    class Wrapper extends React.Component{

        static childContextTypes = {
            store:  React.PropTypes.object
        };

        getChildContext() {
            return {
                store: this.store
            };
        }

        componentWillMount(){

            this.store = stores.store();

            //console.log(['this.store', this.store]);

        }

        render(){

            return  <Wrapper2
            store={this.store}
            />
        }
    }



    return Wrapper

}

export default Connector;





