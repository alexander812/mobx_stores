import { action } from 'mobx';

var actions = {
    @action changeSum (sum) {
        this.winperc = 50;

        setTimeout(()=>{
            this.dealType = 'binary';
            this.sum = sum;
        }, 2000);

    }
};


export default actions;