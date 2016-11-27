import {observable, action, computed, autorun, extendObservable, observe, toJS, asStructure} from "mobx";
import {mix} from "helper/util";
import BaseStore from "helper/BaseStore";
import _ from "lodash";
import surveyActions from "modules/Survey/action/surveyActions";


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

    @computed get questionAsked(){
        return _.find(this.questions, { 'result': true });
    };




    constructor(){
        super();

        this.bind();


        /*
        this.addObserve(
            observe(this, (newValue, oldValue) => {
                console.log(['change', this.question]);
            })
        );
*/

    }

    


}

mix( SurveyStore.prototype, surveyActions );

export default SurveyStore