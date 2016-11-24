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












