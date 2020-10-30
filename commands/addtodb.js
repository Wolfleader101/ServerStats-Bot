const Discord = require("discord.js");
const DbConnect = require("../DB/DbConnect");

module.exports = {
  name: "addtodb",
  cooldown: 5,
  execute(message, args) {
    staff = message.member.roles.cache.some((role) => role.name == "Staff") || message.member.hasPermission("ADMINISTRATOR");
    if (staff) {
      let cArray = ClansJson.clanList;
      cArray.forEach((el) => {
        let cName = el.name;
        let cMembers = el.members;

        cMembers.forEach((mem) => {
          // DB LOGIC
          DbConnect.getConnection((err, con) => {
            if (err) throw err;
            var sql = `SELECT clans.ClanID FROM clans WHERE ClanName = ?;`; // AND UPDATE members SET members.ClanID = clans.ClanID WHERE Username LIKE ? + '%';
            var values = [cName]; //, mem]

            con.query(sql, values, (err, result) => {
              if (err) throw err;
              var ID = result[0].ClanID;

              var sql = `UPDATE members SET members.ClanID = ? WHERE Username LIKE ?;`;
              var values = [ID, mem.concat("%")];

              con.query(sql, values, (err, result) => {
                if (err) throw err;
                console.log(result);
              });
            });

            con.release();
          });
        });
      });

      // add all clans to clans
      // let cArray = ClansJson.clanList
      // cArray.forEach(el => {
      //     // DB LOGIC
      //     DbConnect.getConnection((err, con) => {
      //         if (err) throw err;
      //         var sql = `INSERT INTO Clans (ClanName, ClanSize, ClanLeader, LFM) VALUES ?`;
      //         var values = [
      //             [el.name, el.members.length + 1, el.leader, el.lfm]
      //         ]
      //         con.query(sql, [values], (err, result) => {
      //             if (err) throw err;
      //             console.log("1 record inserted");
      //         });
      //         con.release();
      //     })
      // })

      // ADD ALL MEMBERS to members
      // //Discord.JS
      // let res = message.guild.members.cache;
      // let guidID = message.guild.id;
      // let MemberCount = message.guild.memberCount;
      // let Users = [];

      // res.forEach(el => {
      //     let username = el.user.tag;
      //     let userId = el.id;
      //     let bStaff = el.roles.cache.some((role) => role.name == "Staff") || el.hasPermission("ADMINISTRATOR");

      //     // DB LOGIC
      //     DbConnect.getConnection((err, con) => {
      //         if (err) throw err;
      //         var sql = `INSERT INTO Members (Username, UserID, isStaff) VALUES ?`;
      //         var values = [
      //             [username, userId, bStaff]
      //         ]

      //         con.query(sql, [values], (err, result) => {
      //             if (err) throw err;
      //             console.log("1 record inserted");
      //         });
      //         con.release();
      //     })
      // })
    } else {
      const embed = new Discord.MessageEmbed()
        .setTitle(":no_entry_sign: Permission Denied :no_entry_sign:")
        .setColor("#de1616")
        .setDescription("Error you must be Admin to use this command!");
      message.channel.send({
        embed,
      });
    }
  },
};
