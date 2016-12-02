import _ from 'lodash';
import {getUid} from '_mobx_util';



class RequestModel {

    id = null;
    requestData = null;
    socket = null;
    sent = false;
    filterData = null;
    callback = {};
    uuid = {};

    constructor(req, socket){

        this.id = getUid();
        if(req){
            this._setRequest(req);
        }
        this.socket = socket;

    }

    request(req){

        if(req){
            this._setRequest(req);
        }
        this.socket._send(this);

    }

    onResponse(f){
        this.callback['response'] = f;
        this.socket.requestsHash['response'].push(this);
        return this;

    }

    onFail(f){
        this.callback['fail'] = f;
        return this;
    }

    onPush(f){
        this.callback['push'] = f;
        this.socket.requestsHash['push'].push(this);
        return this;
    }

    clear(){
        this.socket._removeRequest(this);
    }

    filter(arg){
        this.filterData = arg;
    }

    _setRequest(req){

        this.requestData = Array.isArray(req) ? req : [req];
        this.uuid = {};

        this.requestData.forEach((item)=>{

             if(!item.uuid){
                 item.uuid = getUid();
             }

            this.uuid[item.uuid] = 1;

        });
    }

    _response(item){

        if(this.callback[item.type]){
            if(item.type === 'response' && this.uuid[item.uuid]){


                this.callback[item.type](item.event_name, item.data);
                this.clear();
            }
            if(item.type === 'push' && this._checkFilter(item)){
                this.callback[item.type](item.event_name, item.data);
            }
        }
        //удалить при первом респонсе
        if(!this.callback.push && !this.callback.response && !this.callback.fail){
            this.clear();
        }
    }


    _checkFilter(item){

        if(_.isPlainObject(this.filterData)){

            if(_.find([item], this.filterData)){
               return true;
            }

        } else if(typeof this.filterData === 'function'){
            return this.filterData(item);
        }


        return true;
    }
}

/*
      App.user.get('socket').sendAndResponse({
                request: {
                    "data"      : changes,
                    "data_type" : "pair_schedule",
                    "event_name": "pair_schedule:setup"
                },
                onSuccess(){

                    _.each(Ids, function (id) {
                        var model = this.get(id);
                        model.set('status', 'normal');
                    }, this);

                },
                context: this
            });

 */
class SoketModel {
    
    doReconnect = true;
    connect = null;
    /*
    doNotUpdate = null;
    connectionDelay = 1000;
    connectionAttempts = 0;
    connectionAttemptsLimit = 100;
    reconnectTM = null;
    */
    url = true;
    error = null;
    status = 'loading'; // 'loading' | 'ok' | 'fail' | 'closed'
    requests = [];
    requestsHash = {push:[], response:[]};

    
    
    constructor({url='', reconnect = true}){
        
        this.url = url;
        this.doReconnect = reconnect;
        this._createConnection();
        
    }

    request(req){
        return this.add(req);
    }

    add(req){
        var inst = new RequestModel(req, this);
        this.requests.push(inst);
        return inst
    }


    _createConnection(){
        this.connect = new WebSocket(this.url);

        this.connect.onmessage = function(event) {
            this._response(event);
        }.bind(this);

        this.connect.onopen = ()=>{

            this.status = 'ok';
            this._sendAll();


        };

        this.connect.onclose = function(event) {
            if(event.code === 1000 || event.code === 1005){

                this._closeConnection();
                return false;

            }

            /*
            this.set('connectionOk', false);
            this.set('error', 'CONNECTION CLOSED');

            this.reconnectTM = setTimeout(function(){

                this.reconnect();

            }.bind(this), this.connectionDelay);

            */
            

        }.bind(this);

        this.connect.onerror = function(...arg) {
            
            console.error(`Socket error`, arg);
            this.status = 'fail';
            
        }.bind(this);
        
    }

    _closeConnection(){
        this.connect = null;
        this.status = 'closed';
    }



    _sendAll(){

        _.forEach(this.requests, (reqObject, uuid)=>{
            if(!reqObject.sent){
                this._send(reqObject);
            }

        });
    }

    _removeRequest(reqObject){
        reqObject.socket = null;
        _.remove(this.requests, function(item) {
            return item.id === reqObject.id;
        });
    }

    _response(event){
        var data = JSON.parse(event.data);


        data.forEach((item)=>{

            var reqObjectArr = this.requestsHash[item.type];

            if(reqObjectArr && reqObjectArr.length){
                reqObjectArr.forEach((reqObject)=>{

                    reqObject._response(item);


                    /*
                    var filteredData = reqObject._checkFilter(item, item.uuid);

                    if(filteredData){


                        if(reqObject.onResponseOnce){
                            reqObject.onResponseOnce(filteredData);
                            this._removeRequest(reqObject);
                        } else {
                            reqObject.onResponse(filteredData);
                        }

                    }
*/


                });
            }

        });


        /*
        this.requests.forEach((reqObject)=>{

            if(!reqObject.onResponse){
                if(reqObject.requestData && reqObject.sent){
                    this._removeRequest(reqObject);
                }
                //TODO удалить объект если он уже отработал
                return;
            }

            var filteredData = reqObject._checkFilter(data);
            if(filteredData){
                if(reqObject.onResponseOnce){
                    reqObject.onResponseOnce(filteredData);
                    this._removeRequest(reqObject);
                } else {
                    reqObject.onResponse(filteredData);
                }
            }
        });
        */

    }

    _send(reqObject){

        if(this.status !== 'ok'){
            return false;
        }

        this.connect.send(JSON.stringify(reqObject.requestData));
        reqObject.sent = true;

        return true;

    }

}

export default SoketModel;