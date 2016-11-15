import React from 'react';
import PlatformStore from 'stores/PlatformStore';
import {observer, Provider} from 'mobx-react'



var platformStore = new PlatformStore();


console.log(['platformStore', platformStore, platformStore.dealFormSum, Provider]);




setTimeout(function(){

    platformStore.dealFormSum = 100;


}.bind(this), 3000);




console.log(['observer', observer]);


@observer(["platformStore"])
class Component extends React.Component{
    render(){
        

        //this.props.platformStore.dealFormSum
        
        
        console.log(['this.props', this.props]);
        return <div>Dummy component: {this.props.platformStore.dealFormSum}</div>
    }
}


class Entry extends React.Component{
    render(){
        console.log([777]);
        return  (<Provider platformStore={platformStore}>
            <Component/>
        </Provider>)

    }
}
/*

 <Provider>
 <Component/>
 </Provider>
 */



export default Entry;