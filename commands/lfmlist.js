const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')
module.exports = {
    name: "lfmlist",
    cooldown: 5,
    execute(message, args) {

        //DB LOGIC
        DbConnect.getConnection((err, con) => {
            if (err) throw err;
            var sql = `SELECT ClanName FROM clans WHERE LFM = 1`;
            con.query(sql, (err, result) => {
                if (err) throw err;

                let LFMmsg = [];
                result.forEach(el => {
                    LFMmsg.push(`**${el.Username}**\n`);
                })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`:shield: List of Clans LFM`)
                    .setColor("#a134eb")
                    .setDescription(`${LFMmsg}`);
                message.channel.send({
                    embed,
                });
            });
            con.release();
        })

    },
};