const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')
module.exports = {
  name: "clanview",
  cooldown: 5,
  aliases: ["viewclan", "showclan", "clanshow"],
  execute(message, args) {
    const banned = ["nigger", "nigga"];

    usesBannedWords = false;
    args.forEach((el) => {
      if (banned.includes(el)) {
        usesBannedWords = true;
      }
    });
    IfClanExists = message.guild.roles.cache.find((role) => role.name === args[0]);
    if (!args.length || usesBannedWords || !IfClanExists) {
      return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clanview <clanname>\``);
    }

    let Clan = message.guild.roles.cache.find((role) => role.name === args[0]);
    members = Clan.members.map((users) => users.displayName);
    members = members.join("\n");
    let ClanName = Clan.name;

    //DB LOGIC
    const cName = args[0];
    let cMembers = [];
    //const cUsername = message.member.user.tag;
    DbConnect.getConnection((err, con) => {
      if (err) throw err;
      var sql = `SELECT * FROM clans WHERE ClanName = ?;`;
      var values = [cName]


      con.query(sql, [values], (err, result) => {
        if (err) throw err;
        // get ID
        var ID = result[0].ClanID;

        var sql = `SELECT Username FROM members WHERE ClanID = ?`
        var values = [ID]

        con.query(sql, values, (err, res) => {
          if (err) throw err;

          res.forEach(el => {
            cMembers.push(el.Username)
          })
          

          const embed = new Discord.MessageEmbed()
            .setTitle(`:shield: ${result[0].ClanName} Members :shield:`)
            .setColor("#a134eb")
            .setDescription(`:crown: **${result[0].ClanLeader}**\n${cMembers.join("\n")}`)
            .setFooter(`(${cMembers.length}) members`);
          message.channel.send({
            embed,
          });
        });


      });
      con.release();
    })
    // const List = ClansJson.clanList;


    // let foundClan = List.find((clan) => clan.name === cName);
    // let foundLeader = foundClan.leader;
    // let memberLength = foundClan.members.length;
    // let foundMembers = foundClan.members.join("\n");


  },
};