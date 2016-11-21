import React from 'react';
import PlatformStore from 'modules/Platforfm/store/PlatformStore';
import {observer, Provider} from 'mobx-react'
import Connector from 'helper/Connector';
//import globalStore from 'stores/GlobalStore';
import ServerTime from 'modules/Platforfm/components/ServerTime';
import BaseComponent from 'helper/react/BaseComponent';

class Platform extends BaseComponent{

    render(){

        //console.log(['Platform', this]);

        return <div>

            SomeComp:
            <br/>
            Sum:{this.props.sum}
            <br/>
            Earn:{this.props.earn}
            <br/>
            <ServerTime/>
            <br/>

            <a href="javascript:;" onClick={()=>this.act('changeSum', 400)}>Click</a>
        </div>
    }
}

export default Connector(
    Platform,
    [
        function(){return new PlatformStore()}
        //globalStore
    ],

    function(PlatformStore, globalStore){

        return {
            sum:PlatformStore.sum,
            earn:PlatformStore.earn
        }
        
    }
        
);
