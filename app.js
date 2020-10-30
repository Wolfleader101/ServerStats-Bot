// CSHS Discord Bot Entry Point!

//discord modules and variables
const Discord = require('discord.js');
const client = new Discord.Client({ws: {intents: Discord.Intents.ALL}});
const {
    prefix,
    token
} = require('./config.json');
client.commands = new Discord.Collection();

// Handlers
//export client for events
module.exports = {
    client: client
};
// import events
require("./handlers")(client);


//catch any errors
process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));

//login
client.login(token);