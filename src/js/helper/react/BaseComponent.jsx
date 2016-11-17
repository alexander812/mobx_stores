import React from 'react';


class BaseComponent extends React.Component{

    static contextTypes = {
        store: React.PropTypes.object
    };

    act(v1, v2, v3, v4, v5){

        if(!this.context.store){

            console.error('Store for action not found in component: '+Object.getPrototypeOf(this).constructor.name);
            return false;
        }

        if(!this.context.store[v1]){
            console.error('Not found action "'+Object.getPrototypeOf(this.context.store).constructor.name+'.'+v1+'" in the component "'+Object.getPrototypeOf(this).constructor.name+'"');
            return false;
        }

        this.context.store[v1](v2, v3, v4, v5);

    }

    render(){

        return null;
    }
}




export default BaseComponent;





