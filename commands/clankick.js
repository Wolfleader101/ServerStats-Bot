const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')
module.exports = {
    name: "clankick",
    cooldown: 5,
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clankick <@users> <clanname>\``);
        }

        let end = args[args.length - 1];
        const Clan = message.guild.roles.cache.find(role => role.name == end)
        const leader = message.member.roles.cache.some((role) => role.name === "Clan Leader");
        bClanRole = message.member.roles.cache.some((role) => role.name === end);
        if (leader && bClanRole) {

            //get all the users mentioned
            let mentions = message.mentions.users.map(user => user);
            let clanMember = message.guild.roles.cache.find(role => role.name === "Clan Member")
            leadercount = 0;
            mentions.forEach((user, index) => {
                if (message.guild.member(user).roles.cache.find(role => role.name === "Clan Leader")) {
                    leadercount++;
                    return message.channel.send(`${user}, you cannot kick yourself from a clan`);
                }

                if (message.guild.member(user).roles.cache.some((role) => role.name == Clan.name)) {

                    // DB LOGIC
                    DbConnect.getConnection((err, con) => {
                        if (err) throw err;
                        var sql = `UPDATE members INNER JOIN clans ON clans.ClanName = ?SET members.ClanID = NULL WHERE Username = ?;DELETE FROM Clans WHERE ClanName = ?`;
                        var values = [
                            Clan.name, user.tag, Clan.name
                        ]
                        con.query(sql, values, (err, result) => {
                            if (err) throw err;
                            console.log(`A user was kicked from ${clan}`)
                        });
                        con.release();
                    })


                    message.guild.member(user).roles.remove(Clan).catch(console.error);
                    message.guild.member(user).roles.remove(clanMember).catch(console.error);
                }

            })
            if (!leadercount) {
                mentions = mentions.join('\n');
                message.channel.send(`Kicked ${mentions} from **${Clan.name}**`);
            }

        } else {
            message.channel.send(`**${message.author}**,\n You must be a clan leader to perform this command`);
        }
    },
};