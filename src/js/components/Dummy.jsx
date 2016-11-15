import React from 'react';
import PlatformStore from 'stores/PlatformStore';
import {observer, Provider} from 'mobx-react'



var platformStore = new PlatformStore();


//console.log(['platformStore', platformStore, platformStore.dealFormSum, Provider]);




/*

setTimeout(function(){

    platformStore.dealFormSum = 100;

}.bind(this), 3000);

*/




@observer(["platformStore"])
class Component extends React.Component{
    render(){
        


        //console.log(['this.props', this.props]);


        return <div>Dummy component: {this.props.platformStore.dealFormSum}


            <br/>

            <a href="javascript:;" onClick={this.props.platformStore.changeSum.bind(this.props.platformStore, 567)}>Click</a>
        </div>
    }
}


class Entry extends React.Component{
    render(){
   
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