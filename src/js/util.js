import _ from "lodash";
import trans from "trans";


var dateFormatData = {
    'Y': 'getFullYear',
        'y': function (date) {
        return date.getFullYear().toString().substr(2, 2);
    },
    'n': function (date) {
        return (date.getMonth() + 1).toString();
    },
    'm': function (date) {
        var d = dateFormatData.n(date);
        return d.length > 1 ? d : '0' + d;
    },
    'F': function(date) {
        return trans('months_' + date.getMonth());
    },
    'f': function(date) {
        return dateFormatData.F(date).toLowerCase();
    },
    'M': function(date) {
        return trans('months_short_' + date.getMonth());
    },
    't': function(date) {
        return dateFormatData.M(date).toLowerCase();
    },
    'j': function (date) {
        return date.getDate().toString()
    },
    'd': function (date) {
        var d = dateFormatData.j(date);
        return d.length > 1 ? d : '0' + d;
    },
    'G': function (date) {
        return date.getHours().toString();
    },
    'H': function (date) {
        var d = dateFormatData.G(date);
        return d.length > 1 ? d : '0' + d;
    },
    'i': function (date) {
        var d = date.getMinutes().toString();
        return d.length > 1 ? d : '0' + d;
    },
    's': function (date) {
        var d = date.getSeconds().toString();
        return d.length > 1 ? d : '0' + d;
    },
    'u': function (date) {
        var d = date.getMilliseconds().toString();
        return d.length > 2 ? d : d.length > 1 ? '0' + d : '00' + d;
    }
};
var dateFormatDataUTC = {
    'Y': 'getUTCFullYear',
        'y': function (date) {
        return date.getUTCFullYear().toString().substr(2, 2);
    },
    'n': function (date) {
        return (date.getUTCMonth() + 1).toString();
    },
    'm': function (date) {
        var d = dateFormatDataUTC.n(date);
        return d.length > 1 ? d : '0' + d;
    },
    'F': function(date) {
        return trans('months_' + date.getUTCMonth());
    },
    'f': function(date) {
        return dateFormatDataUTC.F(date).toLowerCase();
    },
    'M': function(date) {
        return trans('months_short_' + date.getUTCMonth());
    },
    't': function(date) {
        return dateFormatDataUTC.M(date).toLowerCase();
    },
    'j': function (date) {
        return date.getUTCDate().toString()
    },
    'd': function (date) {
        var d = dateFormatDataUTC.j(date);
        return d.length > 1 ? d : '0' + d;
    },
    'G': function (date) {
        return date.getUTCHours().toString();
    },
    'H': function (date) {
        var d = dateFormatDataUTC.G(date);
        return d.length > 1 ? d : '0' + d;
    },
    'i': function (date) {
        var d = date.getUTCMinutes().toString();
        return d.length > 1 ? d : '0' + d;
    },
    's': function (date) {
        var d = date.getUTCSeconds().toString();
        return d.length > 1 ? d : '0' + d;
    },
    'u': function (date) {
        var d = date.getUTCMilliseconds().toString();
        return d.length > 2 ? d : d.length > 1 ? '0' + d : '00' + d;
    }
};

/**
 * форматирует дату в стиле PHP: http://php.net/manual/ru/function.date.php
 * заменяет в заданной строке все вхождения следующих символов:
 * Y - Номер года, 4 цифры
 * y - Номер года, 2 цифры
 * n - Порядковый номер месяца без ведущего нуля
 * m - Порядковый номер месяца с ведущим нулём
 * F - Название месяца на текущем языке
 * f - Название месяца в нижнем регистре
 * M - Сокращенное наименование месяца, 3 символа
 * t - Сокращенное наименование месяца, 3 символа, в нижнем регистре
 * j - День месяца без ведущего нуля
 * d - День месяца, 2 цифры с ведущим нулём
 * G - Часы в 24-часовом формате без ведущего нуля
 * H - Часы в 24-часовом формате с ведущим нулём
 * i - Минуты с ведущим нулём
 * s - Секунды с ведущим нулём
 * u - Милисекунды
 * @param {Date} date дата
 * @param {String} str формат
 * @returns {string}
 */

export function formatDate(date, str, utc) {
    if (typeof date === 'string') {
        var dateStr = date;
        date = new Date(date);
        if (isNaN(date.getTime())) {
            console.warn('wrong date', dateStr);
            return '';
        }
    } else if (typeof date === 'number') {
        date = new Date(date);
    }
    var i, len, dt = '', l, f;
    for (i = 0, len = str.length; i < len; i++) {
        l = str[i];
        if (/[YynmFfMtjdGHisu]/.test(l)) {
            f = !utc ? dateFormatData[l] : dateFormatDataUTC[l];
            if (typeof f === 'function') {
                dt += f.call(this, date);
            } else if (typeof date[f] === 'function') {
                dt += date[f]();
            } else {
                dt += l;
            }
        } else {
            dt += l;
        }
    }
    return dt;
}

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

export function getTimeDelta(serverTime) {
    return Math.floor((new Date().getTime())/1000) - serverTime;
}

export function currencyLet(c) {
    if (c == 'usd') {
        return 's';
    } else if (c == 'demo') {
        return 'a';
    } else if (c == 'eur') {
        return 'e';
    } else {
        return 'p';
    }
}

export function getUid(){
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 12)).toUpperCase();
}

export function GetUtcTime(timeDelta = 0){
    var now = new Date;
    return Math.floor(
        (Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) - timeDelta)/1000
    );
}

