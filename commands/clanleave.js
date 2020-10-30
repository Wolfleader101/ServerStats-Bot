const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')
module.exports = {
    name: "clanleave",
    cooldown: 5,
    aliases: ['leaveclan'],
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clanleave <clanname>\``);
        }
        const Clan = message.guild.roles.cache.find((role) => role.name === args[0]);
        const leader = message.member.roles.cache.some((role) => role.name === "Clan Leader");
        const bClanRole = message.member.roles.cache.some((role) => role == Clan);
        if (leader) {
            return message.channel.send(`**${message.author}**,\n You cannot do this action as a clan leader`);
        }
        if (!leader && bClanRole) {
            let clanMember = message.guild.roles.cache.find((role) => role.name === "Clan Member");

            // DB LOGIC
            DbConnect.getConnection((err, con) => {
                if (err) throw err;
                var sql = `UPDATE members INNER JOIN clans ON clans.ClanName = ?SET members.ClanID = NULL WHERE Username = ?;DELETE FROM Clans WHERE ClanName = ?`;
                var values = [
                    Clan.name, message.member.user.tag, Clan.name
                ]
                con.query(sql, values, (err, result) => {
                    if (err) throw err;
                    console.log(`A user left ${clan}`)
                });
                con.release();
            })


            message.member.roles.remove(clanMember).catch(console.error);
            message.member.roles.remove(Clan).catch(console.error);

            message.channel.send(`You have left **${Clan.name}**`);
        } else {
            message.channel.send(`**${message.author}**,\n You have to be in this clan to leave`);
        }
    },
};