// require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require("mongoose");
const respondNationalDay = require("./nationalday");
const {respondRPS, playRPS} = require("./games/rps");
const {incrementScam, displayScammers} = require('./leaderboards/scam');
const {incrementLoss, displayLosers} = require("./leaderboards/loser");
const tellJoke = require("./joke");
const {replySay, replyIm, replySecret} = require('./reply');

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

    replySay(msg);
    replyIm(msg);
    replySecret(msg);

});

client.login(process.env.BOT_TOKEN)