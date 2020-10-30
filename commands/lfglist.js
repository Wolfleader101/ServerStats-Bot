const Discord = require("discord.js");
const fs = require('fs');
const DbConnect = require('../DB/DbConnect')

module.exports = {
    name: "lfglist",
    cooldown: 5,
    aliases: ['lfgview', 'viewlfg', 'showlfg', 'lfgshow'],
    execute(message, args) {
        //DB LOGIC
        DbConnect.getConnection((err, con) => {
            if (err) throw err;
            var sql = `SELECT Username FROM members WHERE LFG = 1`;
            con.query(sql, (err, result) => {
                if (err) throw err;
                
                let LFGmsg = [];
                result.forEach(el => {
                    LFGmsg.push(`**${el.Username}**\n`);
                })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`:shield: List of members LFG`)
                    .setColor("#a134eb")
                    .setDescription(`${LFGmsg}`);
                message.channel.send({
                    embed,
                });
            });
            con.release();
        })


    },
};