const Discord = require('discord.js');
const fetch = require("node-fetch");
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

const respondNationalDay = (msg) => {
    if (msg.content.toLowerCase().indexOf("what day is it today") >= 0){
        fetchAsync("https://nationaldaycalendar.com/what-is-national-today/")
            .then(text => getDays(text))
            .then(days => formatDays(days))
            .then(message => msg.channel.send(message))
            .catch(err => msg.channel.send("oops bot screwed up"))
    }
}

module.exports = respondNationalDay;
