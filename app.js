const tmi = require('tmi.js');
const request = require('requests');
const fs = require('fs');

var prefix = "!";
var newLeague = "Ritual";
let chaosPrice = "";
let botOwner = user.username === "vertex101";
let isMod = user.mod || user.username === channel.substr(1);

var URL = `https://poe.ninja/api/data/currencyoverview?league=${newLeague}&type=`;

setInterval(function () {
    request(currencyUrl).on('data', function (response) {
        pullData = JSON.parse(response);
        pullData.lines.forEach(function (chaos) {
            if (chaos.currencyTypeName === "Exalted Orb") {
                chaosPrice = chaos.receive.value
            }
        })
    }).on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
    });
}, 3000);

let options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: process.env.Nick,
        password: process.env.Auth
    },
    channels: ["#vertex101"]
};
let client = new tmi.client(options);
// Connect the client to the server..
client.connect();
//join the channels from the json file
client.on("connected", async (address, port) => {
    //TODO: loop through the json file to connect to the channels
    fs.readFile('config/channel.json', (err, data) => {
        if (err) throw err;
        let jChan = JSON.parse(data);
        for (var key in jChan) {
            var juChan = jChan[key];
            client.join(juChan);
        }
    });
});
client.on("chat", async (channel, user, message, self) => {
    if (self) return;

    if (message.indexOf(prefix) !== 0) return;
    const args = message.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (isMod || botOwner) {
        if (command === "cmds") {
            switch (channel) {
                case '#finncapp':
                    client.say(channel, "Current Commands: !ex, !hunter, !doc, !mirror, !round, !chaos, !exc, !sim, !starter")
                    break;
                default:
                    setTimeout(function () {
                        client.say(channel, "Current Commands: !ex, !hunter, !doc, !mirror, !round, !chaos, !exc, !sim, !starter")
                    }, 3000);
                    break;
            }
        } else if (command === "ex") {
            request(`${URL}Currency`).on('data', function (response) {
                pullData = JSON.parse(response);
                pullData.lines.forEach(function (ex) {
                    if (ex.currencyTypeName === "Exalted Orb") {
                        switch (channel) {
                            case '#finncapp':
                                client.say(channel, "1 Exalted Orb is equal to " + ex.receive.value.toFixed(2) + " Chaos")
                                break;
                            default:
                                setTimeout(function () {
                                    client.say(channel, "1 Exalted Orb is equal to " + ex.receive.value.toFixed(2) + " Chaos")
                                }, 3000);
                                break;
                        }
                    }
                })
            }).on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
        } else if (command === "hunter") {
            request(`${URL}UniqueAccessory`).on('data', function (response) {
                pullData = JSON.parse(response);
                pullData.lines.forEach(function (hunt) {
                    if (hunt.name === "Headhunter") {
                        switch (channel) {
                            case '#finncapp':
                                client.say(channel, "HeadHunter is worth " + hunt.exaltedValue + "ex")
                                break;
                            default:
                                setTimeout(function () {
                                    client.say(channel, "HeadHunter is worth " + hunt.exaltedValue + "ex")
                                }, 3000);
                                break;
                        }
                    }
                })
            }).on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
        } else if (command === "doc") {
            request(`${URL}DivinationCard`).on('data', function (response) {
                pullData = JSON.parse(response);
                pullData.lines.forEach(function (doc) {
                    if (doc.name === "The Doctor") {
                        switch (channel) {
                            case '#finncapp':
                                client.say(channel, "The Doctor is worth " + doc.exaltedValue + "ex")
                                break;
                            default:
                                setTimeout(function () {
                                    client.say(channel, "The Doctor is worth " + doc.exaltedValue + "ex")
                                }, 3000);
                                break;
                        }
                    }
                })
            }).on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
        } else if (command === "mirror") {
            request(`${URL}Currency`).on('data', function (response) {
                pullData = JSON.parse(response);
                pullData.lines.some(function (mir) {
                    if (mir.currencyTypeName === "Mirror of Kalandra") {
                        switch (channel) {
                            case '#finncapp':
                            case '#vertex101':
                                client.say(channel, "Mirror of Kalandra is worth " + Math.round(mir.receive.value / chaosPrice) + " exalts")
                                break;
                            default:
                                setTimeout(function () {
                                    client.say(channel, "Mirror of Kalandra is worth " + Math.round(mir.receive.value / chaosPrice) + " exalts")
                                }, 3000);
                                break;
                        }
                    }
                })
            }).on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
            });
        } else if (command === "round") {
            if (!args[0]) {
                setTimeout(function () {
                    client.say(channel, "Usage: !round [1-9]")
                }, 3000);
            } else {
                request(`${URL}Currency`).on('data', function (response) {
                    pullData = JSON.parse(response);
                    pullData.lines.forEach(function (round) {
                        if (round.currencyTypeName === "Exalted Orb") {
                            var cTotal = (round.receive.value * Number(`0.${args[0]}0`));
                            switch (channel) {
                                case '#finncapp':
                                    client.say(channel, "0." + args[0] + "ex is " + Math.round(cTotal) + "c")
                                    break;
                                default:
                                    setTimeout(function () {
                                        client.say(channel, "0." + args[0] + "ex is " + Math.round(cTotal) + "c")
                                    }, 3000);
                                    break;
                            }
                        }
                    })
                }).on('end', function (err) {
                    if (err) return console.log('connection closed due to errors', err);
                    console.log('end');
                });
            }
        } else if (command === "chaos") {
            if (!args[0]) {
                setTimeout(function () {
                    client.say(channel, "Usage: !chaos [amount]")
                }, 3000);
            } else {
                request(`${URL}Currency`).on('data', function (response) {
                    pullData = JSON.parse(response);
                    pullData.lines.forEach(function (chaos) {
                        if (chaos.currencyTypeName == "Exalted Orb") {
                            var cTotal = (Number(args[0]) / chaos.receive.value)
                            var getOdds = cTotal.toFixed(2).split('.')
                            var cChaos = (chaos.receive.value * Number(`0.${getOdds[1]}`));
                            switch (channel) {
                                case '#finncapp':
                                    client.say(channel, args[0] + "c = " + getOdds[0] + "ex " + Math.round(cChaos) + "c")
                                    break;
                                default:
                                    setTimeout(function () {
                                        client.say(channel, args[0] + "c = " + getOdds[0] + "ex " + Math.round(cChaos) + "c")
                                    }, 3000);
                                    break;
                            }
                        }
                    })
                }).on('end', function (err) {
                    if (err) return console.log('connection closed due to errors', err);
                    console.log('end');
                });
            }
        } else if (command === "exc") {
            if (!args[0]) {
                setTimeout(function () {
                    client.say(channel, "Usage: !exc [amount]")
                }, 3000);
            } else {
                request(`${URL}Currency`).on('data', function (response) {
                    pullData = JSON.parse(response);
                    pullData.lines.forEach(function (exc) {
                        if (exc.currencyTypeName === "Exalted Orb") {
                            if (args[0].includes('.')) {
                                var getARG = args[0].split('.')
                                var cTotal = (Number(getARG[0]) * exc.receive.value)
                                var getOdds = (exc.receive.value * Number("0." + getARG[1]))
                            } else {
                                var cTotal = (Number(args[0]) * exc.receive.value)
                                var getOdds = 0
                            }
                            switch (channel) {
                                case '#finncapp':
                                    client.say(channel, args[0] + "ex = " + Math.round(cTotal + getOdds) + "c")
                                    break;
                                default:
                                    setTimeout(function () {
                                        client.say(channel, args[0] + "ex = " + Math.round(cTotal + getOdds) + "c")
                                    }, 3000);
                                    break;
                            }
                        }
                    })
                }).on('end', function (err) {
                    if (err) return console.log('connection closed due to errors', err);
                    console.log('end');
                });
            }
        } else if (command === "sim") {
            request(`${URL}Fragment`).on('data', function (response) {
                pullData = JSON.parse(response);
                pullData.lines.forEach(function (sim) {
                    if (sim.currencyTypeName === "Simulacrum") {
                        switch (channel) {
                            case '#finncapp':
                                client.say(channel, "Simulacrum is equal to " + Math.round(sim.receive.value) + " Chaos")
                                break;
                            default:
                                setTimeout(function () {
                                    client.say(channel, "Simulacrum is equal to " + Math.round(sim.receive.value) + " Chaos")
                                }, 3000);
                                break;
                        }
                    }
                })
            }).on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
        } else if (command === "starter") {
            switch (channel) {
                case '#finncapp':
                    client.say(channel, "New to PoE (Path of Exile) go here https://www.youtube.com/watch?v=2JPVJIn98B4 and watch Beginner Guide + Zizaran's Tips and Tricks")
                    break;
                default:
                    setTimeout(function () {
                        client.say(channel, "New to PoE (Path of Exile) go here https://www.youtube.com/watch?v=2JPVJIn98B4 and watch Beginner Guide + Zizaran's Tips and Tricks")
                    }, 3000);
                    break;
            }
        }
    }
    if (botOwner) {
        /*         if(command == "vso") {
                    if(args[0]) {
                        request({ url: 'https://api.twitch.tv/kraken/users?login=' + args[0].toLowerCase(), headers: { 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': process.env.idClient}}, function (error, response, body) {
                            pullData = JSON.parse(body);
                            request({ url: 'https://api.twitch.tv/kraken/channels/' + pullData.users[0]._id, headers: { 'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': process.env.idClient}}, function (error, response, body) {
                                pullData = JSON.parse(body);
                                setTimeout(function () {
                                    client.say(channel, "You should 100% check out " + pullData.display_name + "! You can find them," +
                                    " here >> https://twitch.tv/" + pullData.name + " <3 They were last playing >> " + pullData.game + "!")
                                }, 3000);
                            });
                        });
                    }
                } */
        if (command === "bpop") { //
            setTimeout(function () {
                client.say(channel, "Bane POP build by mbXtreme https://www.youtube.com/watch?v=RDJqEdWqdAE the PoB is in the video description")
            }, 3000);
        }
    }
    if (channel === "#finncapp") {
        if (command === "coc") {
            setTimeout(function () {
                client.say(channel,
                    "CoC Ice Nova Assassin" +
                    " ▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬" +
                    " currently running https://www.youtube.com/watch?v=UqC4WM7am20 <-- by Esoro" +
                    " and working torwards https://www.youtube.com/watch?v=lgBaGtv2w6s <-- by Zenn" +
                    " the PoB is in the video descriptions")
            }, 3000);
        }
    }
});