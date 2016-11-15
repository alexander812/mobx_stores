import { observable, action } from 'mobx';



function mixin(source, target) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }
}


var actions = {
    @action someAction (sum) {
        console.log([55, arguments]);
        this.earn = 5;
        this.dealFormSum = sum;

    }
};


class PlatformStore{
    @observable dealFormSum = 0;
    @observable earn = 0;
    constructor(){

        this.earn = 10;
        this.dealFormSum = 888;


        //Object.assign(this, actions);

        console.log('this11', this);

    }

    @action changeSum (sum) {
        console.log([55, arguments]);
        this.earn = 5;
        this.dealFormSum = sum;

    }

}

mixin(actions, PlatformStore.prototype);




export default PlatformStore