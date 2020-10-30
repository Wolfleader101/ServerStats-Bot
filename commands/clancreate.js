const Discord = require("discord.js");
const DbConnect = require('../DB/DbConnect')

module.exports = {
    name: "clancreate",
    cooldown: 5,
    aliases: ['createclan'],
    execute(message, args) {
        const banned = ['nigger', 'nigga']
        usesBannedWords = false;
        args.forEach(el => {
            if (banned.includes(el)) {
                usesBannedWords = true; // check if args contains banned word
            }
        })
        leader = message.member.roles.cache.some((role) => role.name == "Clan Leader"); // check for leader role
        member = message.member.roles.cache.some((role) => role.name == "Clan Member"); // check for member role
        ClanExists = message.guild.roles.cache.some((role) => role.name == args[0]);

        if (leader || member) {
            return message.channel.send(`${message.author}, you cannot create a new clan while currently in one \n please leave your current clan to use this clan`);
        }
        if (!args.length || usesBannedWords || ClanExists) {
            return message.channel.send(`Please provide a valid clan name, ${message.author} \n **Usage:** \`==clancreate <clanname>\``);
        }
        let cName = args.join();
        message.channel.send("Please wait for an admin to approve the clan :smile:")
        CreateClan(message.member.user, cName, message, message.author);




    },
};

function CreateClan(cLeader, cName, message, cPing) {
    const embed = new Discord.MessageEmbed()
        .setTitle(":crossed_swords: Clan Creation :crossed_swords:")
        .setColor("#e69e10")
        .setDescription(`${cPing} wants to create ${cName}`);
    const chan = message.guild.channels.cache.get("712625605904039947");
    chan.send(embed)
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

                    // check if they joined
                    if (reaction.emoji.name === "👍") {
                        // do logic for creating clan
                        SaveToDB(cName, cLeader);

                        // create clan
                        message.guild.roles.create({
                            data: {
                                name: cName,
                            }
                        }).then(el => {
                            let newRole = el.id;
                            // add roles
                            let Leader = message.guild.roles.cache.find(role => role.name === "Clan Leader")
                            message.member.roles.add(Leader).catch(console.error);
                            message.member.roles.add(newRole).catch(console.error);
                        })
                        msg.channel.send(`Created Clan Called: **${cName}**`);
                    } else {
                        msg.channel.send(`Admins declined the creation of **${cName}**!`)
                    }
                })
                .catch((collected) => {
                    msg.reply("you reacted with neither a thumbs up, nor a thumbs down.");
                    console.log(collected)
                });
        });
}



function SaveToDB(cName, cLeader) {

    // DB LOGIC
    DbConnect.getConnection((err, con) => {
        if (err) throw err;
        var sql = ` INSERT INTO Clans (ClanName, ClanSize, ClanLeader, LFM) VALUES ?;UPDATE members  INNER JOIN clans ON clans.ClanName = ? SET members.ClanID = clans.ClanID WHERE Username = ?; UPDATE clans SET ClanSize = ClanSize + 1 WHERE ClanName = ?;`;
        var values = [
            [cName, 1, cLeader, false], cName, cLeader, cName
        ]
        con.query(sql, [values], (err, result) => {
            if (err) throw err;
            console.log("a clan has been made");
        });
        con.release();
    })
}