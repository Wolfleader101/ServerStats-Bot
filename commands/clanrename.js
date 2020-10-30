const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')
module.exports = {
    name: "clanrename",
    cooldown: 5,
    aliases: ["renameclan"],
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clanrename <Oldclanname> <NewClanName>\``);
        }
        const Clan = message.guild.roles.cache.find((role) => role.name === args[0]); // find clan role
        const leader = message.member.roles.cache.some((role) => role.name === "Clan Leader"); // find leader role
        bClanRole = message.member.roles.cache.some((role) => role == Clan); //check if they have clan role

        const staff = message.member.roles.cache.some((role) => role.name == "Staff") ||
            message.member.hasPermission('ADMINISTRATOR'); // check for staff role to bypass restrictions

        // do checks
        if (leader && bClanRole || staff) {
            // find role
            let clan = message.guild.roles.cache.find((role) => role.name === args[0]);
            let newClan = args[1];
            clan.edit({
                name: newClan
            });
            message.channel.send(`**${Clan.name}** has been renamed to **${newClan}**`);


            //DB LOGIC
            const cName = Clan.name;
            //const cUsername = message.member.user.tag;
            DbConnect.getConnection((err, con) => {
                if (err) throw err;
                var sql = `UPDATE clans SET ClanName = ? WHERE ClanName = ?;`;
                var values = [
                    newClan, cName
                ]
                con.query(sql, values, (err, result) => {
                    if (err) throw err;
                    console.log(`${clan} has been renamed to ${newClan}`)
                });
                con.release();
            })

        } else {
            message.channel.send(`**${message.author}**,\n You must be a clan leader or staff to perform this command`);
        }
    },
};