import _ from "lodash";

export function mix(...args) {

    var targ = args[0];

    args.forEach((item, i)=> {
        if (i) {

            Object.getOwnPropertyNames(item).forEach((fname) => {
                if (!targ[fname]) {
                    targ[fname] = item[fname];
                }
            });
        }
    });
}

export function getNestedObject(...args) {

    var targ = args[0];
    var pass = true;
    var res;


    args.forEach((propName, i)=> {
        if(i){

            if (typeof targ[propName] !== 'undefined') {

                res = targ[propName];
                if(targ[propName] instanceof Object){
                    targ = targ[propName];
                }

            } else {
                pass = false;
            }
        }


    });
    return pass ? res : false;
}

export function protoName(object) {
    return Object.getPrototypeOf(object).constructor.name
}








