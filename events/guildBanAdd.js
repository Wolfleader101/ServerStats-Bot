const {
  client
} = require('../app');

//when user is banned
client.on('guildBanAdd', (guild, user) => {
  const general = guild.channels.cache.get("536336402024235021");
  general.send(`${user} was just banned! Next time follow the Rules!`);
});