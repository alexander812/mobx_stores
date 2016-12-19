import { observable, action, computed, autorun, extendObservable, observe, toJS } from 'mobx';
import { mix } from 'mobx/helper/util';
import platformActions  from 'mobx/modules/Platform/action/platformActions';
import globalStore  from 'globalStore';
import BaseStore  from 'mobx/helper/BaseStore';
import {ON_BIND_EVENT, ON_UNBIND_EVENT} from "mobx/constants/common";
import _ from "lodash";
import SingleSelectedModel from "mobx/helper/model/SingleSelectedModel";
import TurboTimeCollection from "mobx/modules/Platform/store/TurboTimeCollection";

import util from "helper/util";
import {formatDate} from '_mobx_util';


class PlatformStore extends BaseStore{

    bindAs = 'Platform';
    debugFields = ['pairCollection', 'rateCollection', 'chartType'];

    @observable pairCollection = null;
    @observable rateCollection = null;
    @observable turboTimeCollection = null;
    @observable rateType = 'line'; // line | candle;
    @observable dealType = 'turbo';// binary | turbo
    @computed get dealServerTime(){
        if(this.dealType === 'turbo'){
            return globalStore.serverTime;
        }
    }

    
    
    /*
    @computed get turboTimeCollection(){

    }
*/



    /*

     serverTime
     App.user.get('tradeSessionCloseTime')
     pair.locked
     pair.timeClose
     App.user.get('dealTurboPeriods')
     userDealCollection.selected

     'dealTurboPeriods':[2, 3, 4, 5, 6, 15, 30, 45, 60, 75, 90, 105, 120],

     */



    constructor(){
        super();

        this.rateCollection = new SingleSelectedModel(Object.assign({}, globalStore.rateCollection));
        this.pairCollection = new SingleSelectedModel(Object.assign({}, globalStore.pairCollection));
        this.turboTimeCollection = new TurboTimeCollection(Object.assign({}, []));


         this.addObserve(
             observe(this, 'rateType', () => {

                 var toSelect= _.find(this.rateCollection.models, {format:this.rateType});
                 if(toSelect){
                     this.rateCollection.select(toSelect.id);
                 }
             })
         );



        var result = this.createTimePeriod(1482166372);
        this.turboTimeCollection.update(result);




/*
        this.addObserve(
            autorun(()=>{

                if(!this.dealServerTime){
                    return;
                }

                var result = this.createTimePeriod(this.dealServerTime);
                this.turboTimeCollection.update(result);


            })
        );
*/

        this.bind();

    }

    //dt.setMinutes(0)


    createTimePeriod(now, form){

        form = form || now;

        var nowRounded = this.roundSec(now);
        var firstMin = nowRounded + 120;
        var step1 = 60;
        var step2 = 15 * 60;
        var step = step1;
        var minsEndMoment = firstMin + (5 * 60);
        var minsMoment = this.findNext15(minsEndMoment);
        var timeClose = this.roundSec(form);
        var result = [];
        var lastTimeClose = minsMoment + (7 * 15 * 60);

        //console.log(['now = ', util.formatDate(new Date(now*1000), 'H:i:s')]);

        for(var i = 0; i < 40; i ++){

            let rest = timeClose - now;

            if(timeClose === minsEndMoment){
                step = step2;
                timeClose = minsMoment;
                console.log(['minsMoment', formatDate(new Date(minsMoment * 1000), 'H:i:s'), now]);

            }

            result.push({
                id:timeClose,
                timeClose:timeClose,
                timeRest:rest,
                disabled: rest < 60
            });

            timeClose += step;

            if(lastTimeClose <= timeClose){
                break;
            }
        }

        result.forEach((item)=>{
            console.log(['result', formatDate(new Date(item.timeClose * 1000), 'H:i:s'), item]);

        });
        console.log(['#########################']);
        return result;
    }

    roundSec(ts){
        var d = new Date(ts*1000);
        return  Math.floor(d.setSeconds(0) / 1000);
    }

    roundMin(ts){
        var d = new Date(ts*1000);
        return  Math.floor(d.setMinutes(0) / 1000);
    }

    findNext15(ts){
        var d = new Date(ts * 1000);

        
        //////////

        console.log(['getMinutes = ' +  formatDate(new Date(ts*1000), 'H:i:s')]);


        console.log(['roundedTs = ' + formatDate(new Date((d.setMinutes(0) && d.setSeconds(0))), 'H:i:s')]);




        var min = d.getMinutes();
        var roundedTs = Math.floor((d.setMinutes(0) && d.setSeconds(0))/1000);




        console.log(['ts = ' + formatDate(new Date(roundedTs * 1000), 'H:i:s')]);
        console.log(['min = ' + min]);


        console.log(['res = ' + formatDate(new Date((roundedTs + (4 - 1)*15) * 1000), 'H:i:s')]);



        return roundedTs + (4 - Math.floor((60-min)/15))*15;
    }


}

mix( PlatformStore.prototype, platformActions );

export default PlatformStore