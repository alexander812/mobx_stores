import { action } from 'mobx';
import _  from 'lodash';
import globalStore  from 'stores/GlobalStore';

var actions = {

    @action answer (answerId) {

        this.selectAnswer(answerId);


        var ans = _.find(this.questions, { 'id': answerId });

        if(ans){
            ans.result = true;
        }

    },
    @action selectAnswer (answerId) {

        var selected = _.find(this.questions, { 'selected': true });
        var toSelect = _.find(this.questions, { 'id': answerId });

        if(toSelect){
            toSelect.selected = true;
        }
        if(selected !== toSelect){
            selected.selected = false;
        }
        console.log(['globalStore.binder.act', globalStore.binder.act]);
        globalStore.binder.act('Platform', 'changeSum', 3000, 22);
    }

};


export default actions;