import React from 'react';
import PlatformStore from 'modules/Platforfm/store/PlatformStore';
import {observer, Provider} from 'mobx-react'
import Connector from 'helper/Connector';
import globalStore from 'stores/GlobalStore';
import BaseComponent from 'helper/react/BaseComponent';

class SomeComp extends BaseComponent{

    render(){

        return <div>

            SomeComp:
            <br/>
            Sum:{this.props.sum}
            <br/>
            Earn:{this.props.earn}
            <br/>
            serverTime:{this.props.serverTime}
            <br/>

            <a href="javascript:;" onClick={()=>this.act('changeSum', 400)}>Click</a>
        </div>
    }
}

export default Connector(
    SomeComp,
    [
        ()=>new PlatformStore(),
        globalStore
    ],

    function(PlatformStore, globalStore){

        return {
            sum:PlatformStore.sum,
            earn:PlatformStore.earn,
            serverTime:globalStore.serverTime
        }
        
    }
        
);
