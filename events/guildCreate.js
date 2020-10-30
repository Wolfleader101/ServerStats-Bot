const {
  client
} = require('../app');
//when bot joins server
client.on('guildCreate', guild => {
  const general = guild.channels.cache.get("536336402024235021");
  general.send(`OCE Bot has joined the server and is ready for action! ${guild.name}`);
});