const Discord = require("discord.js");
module.exports = {
  name: "purge",
  cooldown: 5,
  execute(message, args) {
    staff = message.member.roles.cache.some((role) => role.name == "Staff") || message.member.hasPermission('ADMINISTRATOR');
    if (staff) {
      if (!args.length) {
        return message.channel.send(`Please provide a number of messages to delete, ${message.author} \n **Usage:** \`==purge <numberofmsgs>\``);
      }
      toDelete = parseInt(args[0]) + 1;
      message.channel.bulkDelete(toDelete)
        .then(messages => {
          message.channel.send(`Deleted ${messages.size - 1} messages!`)
        }).catch(console.error)
    } else {
      const embed = new Discord.MessageEmbed()
        .setTitle(":no_entry_sign: Permission Denied :no_entry_sign:")
        .setColor("#de1616")
        .setDescription("Error you must be Admin to use this command!");
      message.channel.send({
        embed,
      });
    }
  },
};