import { observable, action } from 'mobx';


let mix = (superclass) => new MixinBuilder(superclass);

class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}



let Actions1 = (superclass) => class extends superclass {
    @action someAction1 (sum) {
        this.earn = 5;
        this.dealFormSum = sum;

    }
};




let Actions2 = (superclass) => class extends superclass {
    @action changeSum (sum) {
        console.log([55, arguments]);
        this.earn = 5;
        this.dealFormSum = sum;

    }

};



class PlatformStoreProto {


}


class PlatformStore extends mix(PlatformStoreProto).with(Actions1, Actions2){
    @observable dealFormSum = 0;
    @observable earn = 0;
    constructor(){
        super();
        this.earn = 10;
        this.dealFormSum = 888;


        //Object.assign(this, actions);

        console.log('this', this);

    }


}





export default PlatformStore