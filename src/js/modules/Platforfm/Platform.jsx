import React from 'react';
import PlatformStore from 'modules/Platforfm/store/PlatformStore';
import {observer, Provider} from 'mobx-react'


@observer(["store"])
class SomeComp extends React.Component{

    constructor(){

        super();
        //this.act.bind(this);

    }

    act(v1, v2, v3, v4){

        console.log([456456, arguments]);

        if(this.props.store && this.props.store[v1]){
            this.props.store[v1](v2, v3, v4);
        }

        /*
         this.props.store.changeSum.bind(this.props.store, 500)
        */
    }
    render(){


        console.log(['SomeComp', this]);

        return <div>

            SomeComp:
            <br/>
            sum:{this.props.store.sum}

             <a href="javascript:;" onClick={()=>this.act('changeSum', 400)}>Click</a>

        </div>
    }
}





@observer(["store"])
class Component extends React.Component{
    render(){


        console.log(['Component', this]);

        return <div>Dummy component:
            <br/>
            sum:{this.props.store.sum}
            <br/>
            earn:
            {this.props.store.earn}
            <br/>
            winperc:
            {this.props.store.winperc}

            <br/>

             <a href="javascript:;" onClick={this.props.store.changeSum.bind(this.props.store, 500)}>Click</a>

            <SomeComp/>


        </div>
    }
}





class Entry extends React.Component{
    componentWillMount(){

        this.store = new PlatformStore();

    }
    componentWillUnmount(){

    }
    render(){

        return  (<Provider
            store={this.store}
        >
            <Component />
        </Provider>)

    }
}

export default Entry;