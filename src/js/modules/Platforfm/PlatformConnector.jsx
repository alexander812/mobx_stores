import React from 'react';
import PlatformStore from 'modules/Platforfm/store/PlatformStore';
import {observer, Provider} from 'mobx-react'
import Connector from 'util/Connector';
import globalStore from 'stores/GlobalStore';

class SomeComp extends React.Component{

    act(v1, v2, v3, v4){

        if(this.context.store && this.context.store[v1]){
            this.context.store[v1](v2, v3, v4);
        }
    }
    render(){
        
        console.log(['SomeComp', this.props, this]);

        return <div>

            SomeComp:
            <br/>
            Sum:{this.props.sum}
            <br/>
            Earn:{this.props.earn}
            <a href="javascript:;" onClick={()=>this.act('changeSum', 400)}>Click</a>
        </div>
    }
}

SomeComp.contextTypes = {
    store: React.PropTypes.object
};


export default Connector(
    SomeComp,
    {
        store(){
            return new PlatformStore()
        },
        globalStore:globalStore
    },
    {
        helper(){

        }
    }
        
);