const {
  client
} = require('../app');
//when user is unbanned
client.on('guildBanRemove', (guild, user) => {
  const general = guild.channels.cache.get("536336402024235021");
  general.send(`${user} was just unbanned! :grinning:`);
  //console.log(`${user} was just unbanned from ${guild.name}`);
});