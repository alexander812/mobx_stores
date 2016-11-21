import React from 'react';
import {observer, Provider} from 'mobx-react'
import Connector from 'helper/Connector';
import BaseComponent from 'helper/react/BaseComponent';
import SurveyStore from 'modules/Survey/store/SurveyStore';



class Survey extends BaseComponent{


    /*

     {this.questions.map((item, i)=>{
     return <li key={i}>{item.text}</li>
     })}

     */

    render(){

        console.log(['Survey', this]);

        return <ul>

   sddsfd

        </ul>
    }
}

export default Connector(
    Survey,

    function(){return new SurveyStore()},

    function(store){

        return {
            questions:store.questions,
            question:store.question
        }

    }

);
