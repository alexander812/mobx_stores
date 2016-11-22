import React from 'react';
import {observer, Provider} from 'mobx-react'
import Connector from 'helper/Connector';
import BaseComponent from 'helper/react/BaseComponent';
import SurveyStore from 'modules/Survey/store/SurveyStore';


class Survey extends BaseComponent {

    
    render() {

        console.log(['Survey', this]);

        return<div>
            <h4>{this.props.question.text}</h4>

        <ul>

            {
                this.props.questions.map((item)=> {
                    return <li key={item.id}>{item.selected ? '!' : ''}{item.text} <a href="javascript:;" onClick={()=>this.act('selectAnswer', item.id)}>select</a> <a href="javascript:;" onClick={()=>this.act('answer', item.id)}>answer</a></li>
                })
            }
        </ul>
        </div>
    }
}

export default Connector(Survey,

    function () {
        return new SurveyStore()
    },

    function (store) {

        return {
            questions: store.questions,
            question : store.question
        }

    });
