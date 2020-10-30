const {client} = require('../app');
//if server gets deleted
client.on('guildDelete', guild => {
    
    console.log(`I have left ${guild.name} at ${new Date()}`);

});