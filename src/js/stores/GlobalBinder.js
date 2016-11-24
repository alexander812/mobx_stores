import Binder from 'helper/Binder';

class GlobalBinder extends Binder{
    
    constructor(){
        super();

        this.stores = {
            Platform:{},
            Survey:{},
            Dummy:{}
        };

        this.initialize();

    }

    /*

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
                        this.process(targetObject);
                    }


                });




            }




        } else {
            console.error(`bindAs "${bindAs}" from "${Object.getPrototypeOf(module).constructor.name}" not registered in ${Object.getPrototypeOf(this).constructor.name}`);
        }


    }

        */
}

export default GlobalBinder;