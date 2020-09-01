const Discord = require("discord.js")
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const JSSoup = require("jssoup").default;
const fetch = require("node-fetch");


async function fetchAsync(url) {
    let response = await fetch(url)
    let text = await response.text()
    return text
}

const tellJoke = (msg) => {
    if (msg.content.toLowerCase() == "tell me a joke") {
        msg.channel.send("Can you be more specific? What kind of joke?");
    }
    if (msg.content.toLowerCase().match(/tell me an? (.*) joke/)){
        const punTopic = msg.content.toLowerCase().match(/tell me an? (.*) joke/)[1].replace(" ", "-");
        const joke = punTopic => {
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
        joke(punTopic);
    }
}
module.exports = tellJoke;