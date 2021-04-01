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

const replyOur = (msg) => {
    if (!msg.author.bot) {
        const ourPronouns = ["my", "your", "her", "his", "their"]
        const oursPronouns = ["mine", "yours", "hers", "his", "theirs"]
        const wePronouns = ["i", "you", "she", "he", "they"]
        const usPronouns = ["me", "him", "them"]
        if (ourPronouns.some(pronoun => msg.content.toLowerCase().split(" ").includes(pronoun))){
            msg.channel.send("*our")
        } else if (oursPronouns.some(pronoun => msg.content.toLowerCase().split(" ").includes(pronoun))){
            msg.channel.send("*ours")
        } else if (wePronouns.some(pronoun => msg.content.toLowerCase().split(" ").includes(pronoun))) {
            msg.channel.send("*we")
        } else if (usPronouns.some(pronoun => msg.content.toLowerCase().split(" ").includes(pronoun))) {
            msg.channel.send("*us")
        }
    }
}
module.exports = {replySay, replyIm, replySecret, replyOur};