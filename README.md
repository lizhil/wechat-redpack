使用 Node.js 调用微信发送红包

## 使用
    var redpack = require('redpack');

    redpack({
        // 公众号appid
        wxappid: 'xxx',
        // 商户号
        mch_id: 'xxx',
        // 商户API密钥
        apiSecret: 'xxx',
        // 商户证书
        pfx: __dirname + '/cert/apiclient_cert.p12',
        // 随机字符串 可空
        nonce_str:'',
        // 商户订单号 可空
        mch_billno:'',
        // 红包商户名称
        send_name: '红包商户名称',
        // 用户openid
        re_openid: 'xxx',
        // 付款金额，单位分
        total_amount: 100,
        // 红包发放总人数
        total_num: 1,
        // 红包祝福语
        wishing: '感谢您参加猜灯谜活动，祝您元宵节快乐！',
        // Ip地址
        client_ip: '127.0.0.1',
        // 活动名称
        act_name: '活动名称',
        // 备注
        remark: '备注',
    }, function(err, result) {
       console.log(result);
    })


## 微信接口详细介绍
https://pay.weixin.qq.com/wiki/doc/api/cash_coupon.php?chapter=13_5

## 微信在线签名验证工具
https://pay.weixin.qq.com/wiki/tools/signverify/