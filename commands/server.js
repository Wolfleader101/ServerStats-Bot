module.exports = {
  name: 'server',
  cooldown: 5,
  execute(message, args) {
    message.channel.send(`**Server name**: ${message.guild.name}\n **Total members**: ${message.guild.memberCount}`);
  },
};