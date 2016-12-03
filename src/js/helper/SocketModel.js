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

    onClose(f){
        this.callback['close'] = f;
        return this;
    }

    onOpen(f){
        this.callback['open'] = f;
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
        if(!this.callback.push && !this.callback.response && !this.callback.fail && !this.callback.close && !this.callback.status){
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


class SocketModel {
    
    doReconnect = true;
    connect = null;
    connectionDelay = 1000;
    connectionAttempts = 0;
    connectionAttemptsLimit = 100;
    reconnectTM = null;

    /*
    doNotUpdate = null;

    */
    url = true;
    error = null;
    status = 'pending'; // 'pending' | 'opened' | 'closed'
    requests = [];
    requestsHash = {push:[], response:[]};

    
    
    constructor({url='', reconnect = true}){
        
        this.url = url;
        this.doReconnect = reconnect;
        this._createConnection();
        
    }

    request(req){
        var inst = this.add(req);
        inst.request();
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

            this.status = 'opened';
            this.error = null;
            this._notice('open');
            this._sendAll();

        };

        this.connect.onclose = function(event) {

            this._notice('close');
            this._closeConnection();

            if(event.code === 1000 || event.code === 1005){

                return false;
            }
            this.error = event.code;
            this._notice('fail');
            this.reconnectTM = setTimeout(function(){

                this._reconnect();

            }.bind(this), this.connectionDelay);
            

        }.bind(this);

        this.connect.onerror = function(...arg) {
            this._notice('fail');
            this.error = arg;
            console.error(`Socket error`, arg);

            
        }.bind(this);
        
    }

    _reconnect(){

        if(!this.doReconnect || this.connectionAttempts >= this.connectionAttemptsLimit){
            return false;
        }

        this._createConnection();
        this.connectionDelay = this.connectionDelay * 2;
        this.connectionAttempts ++;

    }

    _closeConnection(){
        this.connect = null;
        this.status = 'closed';
    }



    _sendAll(){

        this.requests.forEach((reqObject)=>{
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

        _.forEach(this.requestsHash, (requestArr)=>{
            _.remove(requestArr, function(item) {
                return item.id === reqObject.id;
            });
        });
    }

    _response(event){
        var data = JSON.parse(event.data);


        data.forEach((item)=>{

            var reqObjectArr = this.requestsHash[item.type];

            if(reqObjectArr && reqObjectArr.length){
                reqObjectArr.forEach((reqObject)=>{

                    reqObject._response(item);

                });
            }

        });

    }

    _notice(type){
        this.requests.forEach((reqObject)=>{
            if(typeof reqObject.callback[type] === 'function'){
                reqObject.callback[type]();
            }
        });
    }
    _send(reqObject){

        if(this.status !== 'opened'){
            return false;
        }

        this.connect.send(JSON.stringify(reqObject.requestData));
        reqObject.sent = true;

        return true;

    }

}

export default SocketModel;