import React from 'react';
import PlatformStore from 'stores/PlatformStore';

var platformStore = new PlatformStore();


console.log(['platformStore', platformStore, platformStore.dealFormSum]);

class Component extends React.Component{
    render(){
        return <div>Dummy component</div>
    }
}

export default Component;