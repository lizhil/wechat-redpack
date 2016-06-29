// https://pay.weixin.qq.com/wiki/doc/api/cash_coupon.php?chapter=13_5

var fs         = require('fs')
var crypto = require("crypto");

var xml2js     = require('xml2js');
var request    = require('request');


module.exports = send

// send(params, function(err, reusult) {
//     console.log(reusult);
// })


function send(opts, cb) {

    opts = extend(opts, {
        // 随机字符串
        nonce_str: nonce(),
        // 商户订单号
        mch_billno: now() + Math.round(new Date().getTime() / 1000).toString() + Math.random().toString().substr(2, 8),
    })

    // console.log(opts);

    var pfx = opts.pfx;

    opts.sign = sign(opts);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject({
        xml: opts
    });

    // console.log(xml);
    // console.log(opts);

    request({
            url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack",
            method: 'POST',
            body: xml,
            agentOptions: {
                pfx: fs.readFileSync(pfx),
                passphrase: opts.mch_id
            }
        },
        function(err, response, body) {
            var parser = new xml2js.Parser({
                trim: true,
                explicitArray: false,
                explicitRoot: false
            });
            parser.parseString(body, cb || function(err, result) {});
        });
}




/**
 * 生成签名
 * @Author gyllz@live.com
 * @date   2016-01-10
 * @param  {[type]}       obj [description]
 * @return {[type]}           [description]
 */
function sign(obj) {

    var apiSecret = obj.apiSecret;
    // console.log(obj.apiSecret);

    ['apiSecret', 'pfx'].forEach(function(k) {
        delete obj[k];
    });

    var stringSignTemp = '';
    for (var k of Object.keys(obj).sort()) {
        stringSignTemp += k + '=' + obj[k] + '&'

    }
    // console.log(stringSignTemp + 'key=' + apiSecret);

    return md5(stringSignTemp + 'key=' + apiSecret).toUpperCase();
}


function nonce(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

/**
 * 对象合并
 * @Author gyllz@live.com
 * @date   2015-12-15
 * @param  {object}       target 合并对象
 * @param  {object}       source 原始对象
 * @return {object}       合并后的对象
 */
function extend(target, source) {
    var obj = arguments[0];
    if (arguments.length == 1) {
        return obj;
    }
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            obj[key] = arguments[i][key];
        }
    }
    return obj;
};

function now() {
    var checkTime = function(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }
    var now = new Date();
    var y = now.getFullYear().toString();
    var m = checkTime(now.getMonth() + 1).toString();
    var d = checkTime(now.getDate()).toString();
    return y + m + d;
}


function md5(str) {　　
    str = (new Buffer(str)).toString("binary");　　
    var ret = crypto.createHash('md5').update(str).digest("hex");　　
    return ret;
}