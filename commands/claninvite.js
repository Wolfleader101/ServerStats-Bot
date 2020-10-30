const Discord = require("discord.js");
const config = require("../config.json");
const DbConnect = require('../DB/DbConnect')

module.exports = {
    name: "claninvite",
    cooldown: 5,
    execute(message, args) {
        // check if they dont enter args
        if (args[0] == null || args[args.length - 1] == null) {
            return message.channel.send(`Incorrect Usage of command \n Correct Usage: \`${config.prefix}claninvite <@Users> <clanname>\` \n **Please Note** that you can invite as many people too a clan as long as they aren't already in one`);
        }

        // get clan name
        let clan = args[args.length - 1];
        // check if inviter has leader role and clan role
        leader = message.member.roles.cache.some((role) => role.name == "Clan Leader");
        bClanRole = message.member.roles.cache.some((role) => role.name == clan);
        if (leader && bClanRole) {
            //get all the users mentioned
            let mentions = message.mentions.users.map(user => user);
            mentions.forEach((user, index) => {
                InviteToClan(user);
            })
            mentions = mentions.join('\n')
            message.channel.send(`Invited ${mentions} to ${clan}! \n (*Tip: it sends them a dm*)`)

        } else {
            message.channel.send(`**${message.author}**,\n You must be a clan leader to perform this command`);
        }

        function InviteToClan(user) {
            const embed = new Discord.MessageEmbed()
                .setTitle(":crossed_swords: Clan Invite :crossed_swords:")
                .setColor("#e69e10")
                .setDescription(`You have been invited to **${clan}** Clan! Do you accept the invite?`);
            user
                .send({
                    embed,
                })
                .then((msg) => {
                    msg.react("👍").then(() => msg.react("👎"));

                    const filter = (reaction, user) => {
                        return ["👍", "👎"].includes(reaction.emoji.name) && !user.bot;
                    };

                    msg
                        .awaitReactions(filter, {
                            max: 1,
                            errors: ["time"],
                        })
                        .then((collected) => {
                            const reaction = collected.first();
                            // find clan role
                            let newclan = message.guild.roles.cache.find(role => role.name === clan)
                            // find member role
                            let clanMember = message.guild.roles.cache.find(role => role.name === "Clan Member")

                            // check if they joined
                            if (reaction.emoji.name === "👍") {
                                // add clan and member role
                                message.guild.member(user).roles.add(newclan).catch(console.error);
                                message.guild.member(user).roles.add(clanMember).catch(console.error);
                                msg.reply(`Congrations on joining ${newclan.name}!`)

                                // DB LOGIC
                                DbConnect.getConnection((err, con) => {
                                    if (err) throw err;
                                    var sql = `UPDATE members INNER JOIN clans ON clans.ClanName = ? SET members.ClanID = clans.ClanID WHERE Username = ?;`;
                                    var values = [clan, user.tag, clan]
                                    con.query(sql, values, (err, result) => {
                                        if (err) throw err;
                                        console.log(`A user joined ${clan}`)
                                    });
                                    con.release();
                                })
                            } else {
                                msg.reply(`You have declined the invite to ${newclan.name}`)
                            }
                        })
                        .catch((collected) => {
                            msg.reply("you reacted with neither a thumbs up, nor a thumbs down.");
                        });
                });
        }

    },
};