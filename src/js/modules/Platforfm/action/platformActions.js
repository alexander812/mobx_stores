import { action } from 'mobx';

var actions = {
    @action changeSum1 (sum) {
        this.winperc = 50;

        setTimeout(()=>{
            this.dealType = 'binary';
            this.sum = 500;
        }, 2000);

    }
};


export default actions;