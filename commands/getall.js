const fetch = require('node-fetch');
const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    name: 'getall',
    cooldown: 5,
    execute(message, args) {

        staff = message.member.roles.cache.some((role) => role.name == "Staff") || message.member.hasPermission('ADMINISTRATOR');
        if (staff) {
            let res = message.guild.members.cache;
            let guidID = message.guild.id;
            let MemberCount = message.guild.memberCount;
            let Users = [];


            res.forEach(el => {
                let username = el.displayName;

                // add each user to the array when looping
                Users.push(username);
            });

            if (Users.length >= 10) {
                fs.writeFileSync(`./serverFiles/${guidID}.txt`, JSON.stringify(Users))
                const attachment = new Discord.MessageAttachment(`./serverFiles/${guidID}.txt`)
                message.channel.send(attachment)
            } else {
                message.channel.send(Users)
            }

            //example of what to do with the users
            message.channel.send(`There are **${MemberCount}** in this server`);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle(":no_entry_sign: Permission Denied :no_entry_sign:")
                .setColor("#de1616")
                .setDescription("Error you must be Admin to use this command!");
            message.channel.send({
                embed,
            });
        }
    }
};