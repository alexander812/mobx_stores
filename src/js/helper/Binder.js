import _ from "lodash";
import {observe, toJS} from "mobx";

class Binder{

    modules = {};
    moduleVars = {};
    waitFor = {};
    disposers = {};


    getPath(path){
        this.moduleVars[path] = this.moduleVars[path] || path.split('.');
        return this.moduleVars[path];
    }

    getModule(bindAs){
        return this.modules[bindAs];
    }

    triggerValue(module, item, value){

        if(typeof item === 'function'){
            item.call(module, toJS(value));
        } else {
            module[item] = toJS(value);
        }
    }

    process(m){

        var bindData = m.bindData;
        var bindAs = m.bindAs;

        _.forEach( bindData, (item, key)=>{

            var targetPath = this.getPath(key);
            var targetObject = this.getModule(targetPath[0]);
            var targetModule = targetObject.module;


            if(!targetModule){

                if(!targetObject.waitFor){
                    targetObject.waitFor = [];
                }

                targetObject.waitFor.push(bindAs);

            } else if(targetPath[1]){

                this.triggerValue(m.module, item, targetModule[targetPath[1]]);

                m.disposers.push(

                    observe(targetModule, targetPath[1], ()=>{

                        this.triggerValue(m.module, item, targetModule[targetPath[1]]);

                    })
                );


            }



        });

    }

    bind(module, bindData){
        var m, bindAs = module.bindAs;


        if(bindAs && this.modules[bindAs]){

            m = this.modules[bindAs];

            Object.assign( m,
                {
                    module:module,
                    bindAs:bindAs,
                    bindData:bindData,
                    disposers:[]
                }
            );


            this.process(m, bindData);

            if(m.waitFor && m.waitFor.length){
                m.waitFor.forEach((item)=>{
                    var targetObject = this.getModule(item);
                    if(targetObject.module){
                        //console.log(['targetObject', targetObject]);
                        this.process(targetObject);
                    }


                });




            }



/*

            console.log([this.modules, bindAs, this.modules]);
            if(this.waitFor[bindAs]){

                console.log(['getModule', this.waitFor[bindAs], this.getModule(this.waitFor[bindAs])]);

                //this.process(this.modules[bindAs], bindData);
            }
*/

        } else {
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(module).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
        }

        
    }

    unbind(module){
        if(module.bindAs && this.modules[module.bindAs]){
            delete this.modules[module.bindAs];
        }
    }
}

export default Binder;