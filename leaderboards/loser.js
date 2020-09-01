const Discord = require("discord.js");
const mongoose = require("mongoose");
const Loser = require("../models/loser");

const incrementLoss = (msg) => {
    if (msg.content.toLowerCase().indexOf("game") >= 0 && !msg.author.bot){
        msg.reply("you lost the game")
        async function updateLoserCount(){
            let user = await Loser.find({userId:msg.author.id, serverId:msg.guild.id});
            if (user.length==0) {
                user = await Loser.create({userId:msg.author.id, serverId:msg.guild.id, count:1})
                await user.save();
            } else {
                let user = await Loser.findOneAndUpdate({userId:msg.author.id, serverId:msg.guild.id}, {useFindAndModify: false});
                user.count += 1;
                await user.save();
            }
        }
        updateLoserCount();
    }

}

const displayLosers = (client, msg) => {
    if (msg.content.toLowerCase() == "who are the biggest losers"){
        async function showLosers(){
            let message = "LOSER SCOREBOARD: \n";
            let losers = await Loser.find({serverId:msg.guild.id}).sort({count: -1});
            async function getUsernames(){
                let i = 0
                for (loser of losers){
                    if (i == 10) {
                        break;
                    }
                    i += 1
                    await client.users.fetch(loser.userId).then((user) => {
                        message += i + ". " + user.username + " has lost the game " + loser.count + " time(s) \n"
                    });
                }
            }
            await getUsernames();
            msg.channel.send(message);
        }
        showLosers();
    }
}

module.exports = {incrementLoss, displayLosers};