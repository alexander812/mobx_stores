import {observable, action, computed, autorun, extendObservable, observe, toJS, asStructure} from "mobx";
import {mix} from "helper/util";
import BaseStore from "helper/BaseStore";
import _ from "lodash";


/*
var items = observable([
    {
        id:1,
        title:'Are you ready?'
    },
    {
        id:2,
        title:'Make sense?'
    }
]);


setTimeout(()=>{
    items[1].title = 'bla bla';
}, 1000);



observe(items, () => {

    // here I get changed model and save to server, like below

    ajax('/url',
        {
        id:1,
        title:'bla bla'

    });

});
*/



class SurveyStore extends BaseStore{

    bindAs = 'Survey';

    @observable questions = [
        {
            id:1,
            text:'Are you ready?',
            selected:true,
            result:false
        },
        {
            id:2,
            text:'Make sense?',
            selected:false,
            result:false
        }
    ];


    @computed get question(){
        return _.find(this.questions, { 'selected': true });
    };


    constructor(){
        super();

        this.bind();
        
        this.addObserve(
            observe(this, (newValue, oldValue) => {
                console.log(['change', this.questions]);
            })
        );


    }

    
    @action answer (answerId) {

        this.selectAnswer(answerId);


        var ans = _.find(this.questions, { 'id': answerId });

        if(ans){
            ans.result = true;
        }

    }

    @action selectAnswer (answerId) {

        var selected = _.find(this.questions, { 'selected': true });
        var toSelect = _.find(this.questions, { 'id': answerId });

        if(toSelect){
            toSelect.selected = true;
        }
        if(selected !== toSelect){
            selected.selected = false;
        }

    }

}

//mix( SurveyStore.prototype, surveyActions );

export default SurveyStore