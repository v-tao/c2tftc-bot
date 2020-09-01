// require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const math = require("mathjs");
const mongoose = require("mongoose");
const respondNationalDay = require("./nationalday");
const {respondRPS, playRPS} = require("./games/rps");
const {incrementScam, displayScammers} = require('./leaderboards/scam');
const {incrementLoss, displayLosers} = require("./leaderboards/loser");
const tellJoke = require("./joke")

mongoose.connect("mongodb+srv://vtao:" + process.env.MONGODB_PASSWORD + "@cluster0.ibtua.mongodb.net/" + process.env.DB_NAME+ "?retryWrites=true&w=majority", 
    {useNewUrlParser: true,
    useUnifiedTopology: true}).then(console.log("Connected to DB"));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    respondNationalDay(msg);

    respondRPS(msg);
    playRPS(msg);

    incrementScam(msg);
    displayScammers(client, msg);

    incrementLoss(msg);
    displayLosers(client, msg);

    tellJoke(msg);

    if (msg.content.toLowerCase().indexOf("say ") >= 0 && !msg.author.bot) {
        const newMessage = msg.content.substring(msg.content.toLowerCase().indexOf("say ") + 4, msg.content.length);
        msg.channel.send(newMessage);
    }

    if (msg.content.toLowerCase().indexOf("solve") >= 0){
        try {
            msg.channel.send(math.evaluate(msg.content.substring(msg.content.indexOf("solve ") + 6, msg.content.length)))
        } catch (err) {
            msg.channel.send("I can't do that :(")
        }
    }

});

client.login(process.env.BOT_TOKEN)