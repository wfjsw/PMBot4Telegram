#!/usr/bin/env node 


var version = "`PROJECT PMBOT-HEROKU VERSION 20160514`";

'use strict';

var Telegram = require('node-telegram-bot-api');
var config = {
     tg_bot_api_key : process.env.BOT_TOKEN,
     sudo_user : parseInt(process.env.ADMIN_ID),
     hookport : process.env.PORT,
     hookuri : process.env.HOOK_URI + '/bot' + process.env.BOT_TOKEN
};


var tg = new Telegram(config.tg_bot_api_key, { webhook: { port: config.hookport } });

var tgid, tgusername;
var inittime = Math.round(new Date().getTime() / 1000);

tg.on('message', function (msg) {
    if (msg.date < (inittime - 600))
        return;
    console.log(msg);
    if (msg.text == "/version") {
        tg.sendMessage(msg.from.id, version, { parse_mode: 'Markdown' });
        return;
    } else if (msg.text == "/ping") {
        tg.sendMessage(msg.from.id, "`ACK`", { parse_mode: 'Markdown' });
        return; 
    } else if (msg.text == "/start" || msg.text == "/help") {
        tg.sendMessage(msg.from.id, "Greeting! This is a pseudo communicating tunnel. Say /ping before you use. Do not forward other's word here.\n\n这个bot可以实现您与我的主人的双向通讯，无需受Report Spam限制影响。\n为避免 Bot 工作异常，请不要将其他用户的话转发过来。\n每次使用之前请发送 /ping 指令确认bot存活");
        return;
    } 
    if (msg.from.id == config.sudo_user) {
        // ADMIN AREA
        if (msg.text.split(' ')[0] == "/to") {
            tg.forwardMessage(msg.text.split(' ')[1], msg.chat.id, msg.reply_to_message.message_id);
            return;
        }
        if (msg.reply_to_message.from.id == tgid && msg.reply_to_message.forward_from && msg.reply_to_message.forward_from != config.sudo_user) {
            tg.forwardMessage(msg.reply_to_message.forward_from.id, msg.chat.id, msg.message_id);
            return;
        }
    } else {

        console.log("proceed forward");
        tg.forwardMessage(config.sudo_user, msg.chat.id, msg.message_id);
    }
});


tg.getMe().then(function (ret) {
    console.log(ret);
    tgid = ret.id;
    tgusername = ret.username;
    tg.setWebHook(config.hookuri);
    console.log('PROJECT PMBOT-HEROKU INITATED');
    tg.sendMessage(config.sudo_user, "`GREETINGS!`\n`PROJECT PMBOT-HEROKU INITATED`", { parse_mode: 'Markdown' });
})