const Discord = require("discord.js");
module.exports = {
  name: "help",
  cooldown: 5,
  execute(message, args) {
    args = args.map(function (x) {
      return x.toLowerCase()
    })
    if (args[0] == null) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Help Categories")
        .setColor("#039efc")
        .setDescription("1. **Fun Commands**\n 2.**Clan Commands**\n 3.**Admin Commands** \n **Usage:** ==help fun")
        .setFooter("Note: some commands are buggy and may change")
        .setImage("https://cdn.discordapp.com/attachments/668999302642925589/707523234526003280/bot_pfp_oce.jpg");
      message.channel.send({
        embed,
      });
    } else if (args[0] == "fun" || args[0] == "1") {
      const embed = new Discord.MessageEmbed()
        .setTitle("Fun Commands")
        .setColor("#ffaa00")
        .setDescription("1. **rtd**\n 2.**coinflip**\n 3.**ping** \n 4.**server** \n")
        .setFooter("Note: some commands are buggy and may change");
      message.channel.send({
        embed,
      });
    } else if (args[0] == "clan" || args[0] == "2") {
      const embed = new Discord.MessageEmbed()
        .setTitle("Clan Commands")
        .setColor("#00ffe5")
        .setDescription(
          "1. **clancreate** `==clancreate <clanname>` \n 2.**claninvite** `==claninvite <@Users> <clanname>` \n 3.**clanleave** `==clanleave <clanname>` \n 4.**clanview** `==clanview <clanname>` \n 5.**clankick** `==clankick <@users> <clanname>` \n 6.**clandisband** `==clandisband <clanname>` \n 7.**clanlist** `==clanlist` \n 8.**lfg** `==lfg` \n 9.**lfglist** `==lfglist` \n 10.**lfm** `==lfm <CLANNAME>` \n 11.**lfmlist** `==lfmlist`  "
        )
        .setFooter("Note: some commands are buggy and may change");
      message.channel.send({
        embed,
      });
    } else if (args[0] == "admin" || args[0] == "3") {
      const embed = new Discord.MessageEmbed()
        .setTitle("Admin Commands")
        .setColor("#ff1900")
        .setDescription(":construction: Coming Soon! :construction:")
        .setFooter("Note: some commands are buggy and may change");
      message.channel.send({
        embed,
      });
    }
  },
};