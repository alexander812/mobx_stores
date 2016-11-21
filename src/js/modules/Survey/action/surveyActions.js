import { action } from 'mobx';
import _  from 'lodash';

var actions = {
    @action answer (answerId) {

        console.log(['answer']);

        var ans = _.find(this.questions, { 'id': answerId });

        if(ans){
            ans.result = true;
        }

    },

    @action selectAnswer (answerId) {

        console.log(['selectAnswer']);
        
        var selected = _.find(this.questions, { 'selected': true });
        var current = _.find(this.questions, { 'id': answerId });

        if(selected){
            selected.selected = false;
        }
        if(current){
            selected.selected = true;
        }

    }
};


export default actions;