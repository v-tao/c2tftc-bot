const Discord = require('discord.js');

const respondRPS = (msg) => {
    if (msg.content.toLowerCase().indexOf("play rock paper scissors") >= 0 && !msg.author.bot){
        msg.channel.send("Let's play rock paper scissors! You have 60 seconds to react with your move.")
    }
}

const rpsFilter = (reaction, user) => {
    return (reaction.emoji.name == "✊" || reaction.emoji.name == "✋" || reaction.emoji.name == "✌️" )&& !user.bot;
}

const playRPS = (msg) => {
    if (msg.content == "Let's play rock paper scissors! You have 60 seconds to react with your move."){
        msg.react("✊")
            .then(msg.react("✋"))
            .then(msg.react("✌️"))
            .then(() => {
                const rpsCollector = msg.createReactionCollector(rpsFilter, {max: 1, time: 60000, errors: ["time"]})
                rpsCollector.on("collect", reaction => {
                    let answer = "";
                    if (Math.random() <= 0.33) {
                        answer = {emoji:"✊", name:"rock"};
                    } else if (Math.random() >= 0.66) {
                        answer = {emoji:"✋", name:"paper"};
                    } else {
                        answer = {emoji:"✌️", name:"scissors"};
                    }
    
                    let winMessage = ""
                    if (reaction.emoji.name == answer.emoji){
                        winMessage = "We tied!"
                    } else if (reaction.emoji.name == "✊"){
                        winMessage = answer.emoji == "✋" ? "I win!" : "I lose!"
                    } else if (reaction.emoji.name == "✋"){
                        winMessage = answer.emoji == "✌️" ? "I win!" : "I lose!"
                    } else if (reaction.emoji.name == "✌️"){
                        winMessage = answer.emoji == "✊" ? "I win!" : "I lose!"
                    }
                    msg.channel.send(`${answer.emoji} I choose ${answer.name}. ${winMessage}`)
                })
            })
            .catch((err) => msg.channel.send(err))
    }
}

module.exports = {respondRPS, playRPS}