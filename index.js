// require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const respondNationalDay = require("./nationalday");
const {respondRPS, playRPS} = require("./games/rps");
const {incrementScam, displayScammers} = require('./leaderboards/scam');
const {incrementLoss, displayLosers} = require("./leaderboards/loser");
const tellJoke = require("./joke");
const {replySay, replyIm, replySecret} = require('./reply');
const Reminder = require("./models/reminder");

mongoose.connect("mongodb+srv://vtao:" + process.env.MONGODB_PASSWORD + "@cluster0.ibtua.mongodb.net/" + process.env.DB_NAME+ "?retryWrites=true&w=majority", 
    {useNewUrlParser: true,
    useUnifiedTopology: true}).then(console.log("Connected to DB"));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    scheduleCronJobs();
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

    addReminder(msg);
    showReminders(msg);
    deleteReminder(msg).catch(err => console.log(err));
});

async function dmUser(userId, message) {
    let user = await client.users.fetch(userId).catch((err) => console.log(err));
    if (!user) return console.log("User not found:(");
    await user.send(message).catch((err) => console.log(err));
}

const addReminder = (msg) => {
    if (msg.content.toLowerCase().indexOf("remind me at ") == 0) {
        let userId = msg.author.id;
        let minute = msg.content.substring(16, 18);
        let hour = msg.content.substring(13, 15);
        let message = msg.content.substring(18, msg.content.lengh);
        async function newReminder() {
            let reminder = await Reminder.create({
                userId: userId,
                minute: minute,
                hour: hour,
                message: message,
            })
            msg.reply("reminder successfully created. id: " + reminder._id);
            await reminder.save();
        }
        newReminder().catch((err) => console.log(err));
        const cronJob = schedule.scheduleJob(minute + " " + hour + " * * *", () => {
            dmUser(userId, message);
        })
    }
}

async function deleteReminder(msg) {
    if (msg.content.toLowerCase().indexOf("delete reminder ") == 0) {
        await Reminder.findByIdAndDelete(msg.content.substring(16, msg.content.length));
        msg.reply("reminder successfully deleted")
    }
}

async function showReminders(msg) {
    let message = ""
    if (msg.content.toLowerCase().indexOf("what are my reminders") == 0) {
        let reminders = await Reminder.find({userId: msg.author.id});
        if (reminders.length > 0) {
            for (let i = 0; i < reminders.length; i++) {
                let minute = reminders[i].minute < 10 ? "0" + reminders[i].minute : reminders[i].minute;
                message += "**ID:** " + reminders[i]._id + " **TIME:** " + reminders[i].hour + ":" + minute + " **MESSAGE:** " + reminders[i].message;
                if (!(i == reminders.length - 1)) {
                    message += "\n"
                }
            }
            msg.channel.send(message);
        } else {
            msg.channel.send("you have no reminders")
        }
    }
}

async function scheduleCronJobs() {
    let reminders = await Reminder.find({});
    for (reminder of reminders) {
        const job = schedule.scheduleJob(reminder.minute + " " + reminder.hour + " * * *", () => {
            dmUser(reminder.userId, reminder.message);
        })
    }
}

client.login(process.env.BOT_TOKEN);


