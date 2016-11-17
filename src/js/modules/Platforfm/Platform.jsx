import React from 'react';
import PlatformStore from 'modules/Platforfm/store/PlatformStore';
import {observer, Provider} from 'mobx-react'



@observer(["platformStore"])
class Component extends React.Component{
    render(){

        //console.log(['this.props', this.props]);

        return <div>Dummy component:
            <br/>
            sum:{this.props.platformStore.sum}
            <br/>
            earn:
            {this.props.platformStore.earn}
            <br/>
            winperc:
            {this.props.platformStore.winperc}

            <br/>

            {/*
             <a href="javascript:;" onClick={this.props.platformStore.changeSum.bind(this.props.platformStore, 500)}>Click</a>
            */}


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

        return  (<Provider platformStore={this.store}>
            <Component/>
        </Provider>)

    }
}

export default Entry;