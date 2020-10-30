const DbConnect = require('../DB/DbConnect')
const fs = require('fs');
module.exports = {
    name: 'lfm',
    cooldown: 5,
    execute(message, args) {
        const leader = message.member.roles.cache.some((role) => role.name === "Clan Leader");
        const cName = args[0];
        const bClanRole = message.member.roles.cache.some((role) => role.name === cName);
        if (leader && bClanRole) {

            //DB LOGIC
            DbConnect.getConnection((err, con) => {
                if (err) throw err;
                var sql = `SELECT * FROM clans WHERE ClanName = ?`;
                var values = [
                    [cName]
                ]
                con.query(sql, [values], (err, result) => {
                    if (err) throw err;
                    if (result[0].LFM == 1) {
                        var sql = `UPDATE clans SET LFM = 0 WHERE ClanName = ?;`
                        con.query(sql, [values], (err, res) => {
                            if (err) throw err;
                            console.log(`${cName} is now not LFM`)
                            message.channel.send('Your can is now not searching for members!')
                        });
                    } else {
                        var sql = `UPDATE clans SET LFM = 1 WHERE ClanName = ?;`
                        con.query(sql, [values], (err, res) => {
                            if (err) throw err;
                            console.log(`${cName} is now LFM`)
                            message.channel.send('Your clan is now searching for members!')
                        });
                    }
                });
                con.release();
            })
        } else {
            message.channel.send(`**${message.author}**,\n You must be a clan leader or staff to perform this command`);
        }
    },
};