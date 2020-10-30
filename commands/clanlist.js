const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')

module.exports = {
    name: "clanlist",
    cooldown: 5,
    aliases: ['listclans', 'showclans', 'viewclans'],
    execute(message, args) {

        // DB LOGIC
        DbConnect.getConnection((err, con) => {
            if (err) throw err;
            var sql = `SELECT ClanName, ClanSize, ClanLeader FROM clans;`;
            con.query(sql, (err, result) => {
                if (err) throw err;

                let clanMsg = [];
                result.forEach(el => {
                    clanMsg.push(`**${el.ClanName}** (${el.ClanLeader}) \n ${el.ClanSize} members`); // add extra 1 to account for leader
                })
                clanMsg = clanMsg.join('\n')
                const embed = new Discord.MessageEmbed()
                    .setTitle(`:shield: List of Clans`)
                    .setColor("#a134eb")
                    .setDescription(`${clanMsg}`);
                message.channel.send({
                    embed,
                });
            });
            con.release();
        })


    },
};