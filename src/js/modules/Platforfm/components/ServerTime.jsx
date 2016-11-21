import React from 'react';
import {observer, Provider} from 'mobx-react'
import BaseComponent from 'helper/react/BaseComponent';
import Connector from 'helper/Connector';

class ServerTime extends BaseComponent{

    render(){


        //console.log(['ServerTime', this, this.props]);

        return <div>

            ServerTime:{this.props.serverTime}
        </div>
    }
}


export default Connector(
    ServerTime,
    null,
    function(PlatformStore){

        return {
            serverTime:PlatformStore.serverTime,
            questions:PlatformStore.questions
        }
        
    }
        
);
