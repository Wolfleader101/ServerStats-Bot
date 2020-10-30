const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')

module.exports = {
    name: "clandisband",
    cooldown: 5,
    aliases: ["disbandclan"],
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clandisband <clanname>\``);
        }
        const Clan = message.guild.roles.cache.find((role) => role.name === args[0]); // find clan role
        const leader = message.member.roles.cache.some((role) => role.name === "Clan Leader"); // find leader role
        bClanRole = message.member.roles.cache.some((role) => role == Clan); //check if they have clan role

        const staff = message.member.roles.cache.some((role) => role.name == "Staff") ||
            message.member.hasPermission('ADMINISTRATOR'); // check for staff role to bypass restrictions

        // do checks
        if (leader && bClanRole || staff) {
            //Clan name
            const cName = args[0];
            // find role
            let clanLeader = message.guild.roles.cache.find((role) => role.name === "Clan Leader");
            // remove role
            message.member.roles.remove(clanLeader).catch(console.error);
            // re remove role as sometimes doesnt remove it...
            if (leader) {
                message.member.roles.remove(clanLeader).catch(console.error);
            }

            //get all members with that role
            let members = Clan.members.map((users) => users);
            //get clan member role
            let clanMember = message.guild.roles.cache.find((role) => role.name === "Clan Member");
            // for reach member in clan, remove clan member role
            members.forEach((el) => {
                message.guild.member(el).roles.remove(clanMember).catch(console.error);
                DbConnect.getConnection((err, con) => {
                    if (err) throw err;
                    var sql = ` UPDATE members 
                                INNER JOIN clans ON clans.ClanName = ?
                                SET members.ClanID = NULL WHERE Username = ?;
                                DELETE FROM Clans WHERE ClanName = ?`;
                    var values = [
                        cName, el.tag, cName
                    ]
                    con.query(sql, [values], (err, result) => {
                        if (err) throw err;
                        console.log("a clan has been deleted");
                    });
                    con.release();
                })
            });

            message.channel.send(`**${Clan.name}** has been disbanded!`);
            Clan.delete();

            //DB LOGIC
            DbConnect.getConnection((err, con) => {
                if (err) throw err;
                var sql = `UPDATE members INNER JOIN clans ON clans.ClanName = ?SET members.ClanID = NULL WHERE Username = ?;DELETE FROM Clans WHERE ClanName = ?`;
                var values = [
                    cName, message.author.tag, cName
                ]
                con.query(sql, [values], (err, result) => {
                    if (err) throw err;
                    console.log("a clan has been deleted");
                });
                con.release();
            })

        } else {
            message.channel.send(`**${message.author}**,\n You must be a clan leader or staff to perform this command`);
        }
    },
};