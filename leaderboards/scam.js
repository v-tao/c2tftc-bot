const Discord = require('discord.js');
const mongoose = require("mongoose");
const Scammer = require("../models/scammer");

const incrementScam = (msg) => {
    if (msg.content.indexOf("scam++") == 0){
        const scammer = msg.mentions.users.first();
        if (!scammer){
            return;
        }
        async function updateScamCount(){
            let user = await Scammer.find({userId:scammer.id, serverId:msg.guild.id});
            if (user.length==0) {
                user = await Scammer.create({userId:scammer.id, serverId:msg.guild.id, count:1})
                await user.save();
            } else {
                let user = await Scammer.findOneAndUpdate({userId:scammer.id, serverId:msg.guild.id}, {useFindAndModify: false});
                user.count += 1;
                await user.save();
            }
        }
        updateScamCount();
    }
}

const displayScammers = (client, msg) => {
    if (msg.content.toLowerCase() == "who are the biggest scammers"){
        async function showScammers(){
            let message = "SCAM COUNT: \n";
            let scammers = await Scammer.find({serverId:msg.guild.id}).sort({count: -1});
            async function getUsernames(){
                let i = 0
                for (scammer of scammers){
                    if (i == 10) {
                        break;
                    }
                    i += 1
                    await client.users.fetch(scammer.userId).then((user) => {
                        let time = scammer.count > 1 ? "times" : "time";
                        message += i + ". " + user.username + " has scammed " + scammer.count + " " + time + " \n"
                    });
                }
            }
            await getUsernames();
            msg.channel.send(message);
        }
        showScammers();
    }
}

module.exports = {incrementScam, displayScammers};