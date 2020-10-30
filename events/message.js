const {
    client
} = require('../app');
const {
    prefix
} = require('../config.json')
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();


//commands
client.on('message', message => {
    //stop spam
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //allow for arguments.
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (!cooldowns.has(command)) {
        cooldowns.set(command, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args)
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});