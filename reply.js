const Discord = require("discord.js");

const reply = (text, word) => {
    let message = "";
    if (text.toLowerCase().indexOf(word) == 0) {
        message = text.substring(word.length, text.length);
    } else if (text.toLowerCase().indexOf(" " + word) > 0){
        message = text.substring(text.toLowerCase().indexOf(" " + word) + word.length + 1, text.length);
    }
    return message;
}

const replySay = (msg) => {
    if (!msg.author.bot && reply(msg.content, "say") != "") {
        msg.channel.send(reply(msg.content, "say "));
    }
}

const replyIm = (msg) => {
    let message = "";
    if (reply(msg.content, "im ").length > reply(msg.content, "i'm ").length){
        message = reply(msg.content, "im ");
    } else if (reply(msg.content, "im ").length < reply(msg.content, "i'm ").length) {
        message = reply(msg.content, "i'm ");
    }
    if (message.length > 0 && !msg.author.bot){
        const prob = Math.random();
        let response = "";
        if (prob <= 0.33) {
            response = "No you're not, you're " + msg.author.username;
        } else if (prob <= 0.66) {
            response = "Hi " + message + ", I'm c2tftc-bot"
        } else {
            response = "Hi " + message + ", I'm dad"
        }
        msg.channel.send(response);
    }
}

const replySecret = (msg) => {
    if (msg.content=="I proudly announce that I am a furry uwu") {
        msg.channel.send("The answer to this puzzle is MESSAGES");
    }
}

module.exports = {replySay, replyIm, replySecret};