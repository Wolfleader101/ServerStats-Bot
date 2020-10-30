const { default: fetch } = require("node-fetch");

module.exports = {
    name: 'ping',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Pinging!').then(sent => {
            sent.edit(`Pong! this took: \`${sent.createdTimestamp - message.createdTimestamp}ms\` :heart:`);
        });

    },
};