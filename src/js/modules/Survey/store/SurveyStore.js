import { observable, action, computed, autorun, extendObservable, observe } from 'mobx';
import { mix } from 'helper/util';
import surveyActions  from 'modules/Survey/action/surveyActions';
import BaseStore  from 'helper/BaseStore';
import _  from 'lodash';

class SurveyStore extends BaseStore{



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
            result:false
        }
    ];

    @computed get question(){
        return _.find(this.questions, { 'selected': true });
    };

    constructor(){
        super();
    }

}

mix( SurveyStore.prototype, surveyActions );

export default SurveyStore