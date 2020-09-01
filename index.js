require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const JSSoup = require("jssoup").default;
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const math = require("mathjs");
const mongoose = require("mongoose");
const Loser = require("./models/loser");
const Scammer = require("./models/scammer");

mongoose.connect("mongodb+srv://vtao:" + process.env.MONGODB_PASSWORD + "@cluster0.ibtua.mongodb.net/" + process.env.DB_NAME+ "?retryWrites=true&w=majority", 
    {useNewUrlParser: true,
    useUnifiedTopology: true}).then(console.log("Connected to DB"));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

async function fetchAsync(url) {
    let response = await fetch(url)
    let text = await response.text()
    return text
}

async function getDays(text) {
    let days = text.match(/<meta itemprop='description' content='(.*?)' \/>/g);
    days = days.map(str => str.substring(38, str.indexOf("' />")))
    return days
}

const formatWords = (str) => {
    let words = str.split(" ")
    words = words.map(word => word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase());
    return words.join(" ")
}

const formatDays = (days) => {
    let message = "Happy "
    for (let i = 0; i < days.length; i ++){
        if (i == days.length-1) {
            message += "and " + formatWords(days[i]) + "!"
        } else {
            message += formatWords(days[i]) + ", "
        }
    }
    return message
}

client.on('message', msg => {

    const rpsFilter = (reaction, user) => {
        return (reaction.emoji.name == "✊" || reaction.emoji.name == "✋" || reaction.emoji.name == "✌️" )&& !user.bot;
    }
    

    if (msg.content.toLowerCase().indexOf("say ") >= 0 && !msg.author.bot) {
        const newMessage = msg.content.substring(msg.content.toLowerCase().indexOf("say ") + 4, msg.content.length);
        msg.channel.send(newMessage);
    }

    if (msg.content.toLowerCase().indexOf("play rock paper scissors") >= 0 && !msg.author.bot){
        msg.channel.send("Let's play rock paper scissors! You have 60 seconds to react with your move.")
    }

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

    if (msg.content.toLowerCase().indexOf("what day is it today") >= 0){
        fetchAsync("https://nationaldaycalendar.com/what-is-national-today/")
            .then(text => getDays(text))
            .then(days => formatDays(days))
            .then(message => msg.channel.send(message))
            .catch(err => msg.channel.send("oops bot screwed up"))
    }

    if (msg.content === "hi bot") {
        msg.reply("hello insect")
    }

    if (msg.content.toLowerCase().indexOf("fantastic") >= 0){
        msg.channel.send("shut up isaac")
    }

    if (msg.content.toLowerCase().indexOf("solve") >= 0){
        try {
            msg.channel.send(math.evaluate(msg.content.substring(msg.content.indexOf("solve ") + 6, msg.content.length)))
        } catch (err) {
            msg.channel.send("I can't do that, stupid")
        }
    }

    if (msg.author.id == 356797398040707075) {
        msg.channel.send("alex no")
    }

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
                        message += i + ". " + user.username + " has scammed " + scammer.count + " time(s) \n"
                    });
                }
            }
            await getUsernames();
            msg.channel.send(message);
        }
        showScammers();
    }

    if (msg.content.toLowerCase().match(/tell me an? (.*) joke/)){
        const punTopic = msg.content.toLowerCase().match(/tell me an? (.*) joke/)[1].replace(" ", "-");
        const firstSite = punTopic => {
            fetchAsync("https://punsandoneliners.com/randomness/" + punTopic + "-jokes/")
                .then((text)=> {
                    if (text && text.indexOf("404 Not Found") < 0) {
                        const checkText = soupObject => soupObject.text != "&nbsp;"
                        let soup = new JSSoup(text);
                        let div = soup.find("div", "entry-content");
                        let p = div.findAll("p");
                        p = p.slice(4, p.length-4);
                        let puns = p.filter(checkText);
                        let pun = puns[Math.floor(Math.random() * puns.length)];
                        msg.channel.send(entities.decode(pun.text));
                        resolve(true);
                    } else {
                        msg.channel.send("Sorry, I don't know any jokes about that topic")
                    }
                }).catch(()=> {
                    return true;
                });
        }
        firstSite(punTopic);
        // async function secondSite(punTopic){
        //     let done = await firstSite(punTopic);
        //     if (done) {
        //         return true;
        //     } else {
        //         fetchAsync("https://punsandjokes.com/" + punTopic + "-puns/")
        //             .then((text) => {
        //                 if (text.indexOf("Page not found") < 0){
        //                     let soup = new JSSoup(text);
        //                     let div = soup.find("div", "text");
        //                     let ul = div.find("ul");
        //                     let puns = ul.findAll("strong");
        //                     let pun = puns[Math.floor(Math.random() * puns.length)];
        //                     msg.channel.send(pun.text);
        //                     return true;
        //                 } else {
        //                     return false;
        //                 }
        //             }) .catch(()=> {
        //                 return true;
        //             })
        //     }
        // }

    }
});

client.login(process.env.BOT_TOKEN)