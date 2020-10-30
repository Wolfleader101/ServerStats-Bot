const DbConnect = require('../DB/DbConnect')
const fs = require("fs");
module.exports = {
  name: "lfg",
  cooldown: 5,
  execute(message, args) {
    const bLFG = message.member.roles.cache.some((role) => role.name === "LFG");
    const LFGRole = message.guild.roles.cache.find((role) => role.name === "LFG");
    // if has LFG
    if (bLFG) {
      // remove role
      message.member.roles.remove(LFGRole).catch(console.error);
      message.channel.send("Removed LFG Role for you");
      RemoveFromDB(message.member);
    } else {
      // add role
      message.member.roles.add(LFGRole).catch(console.error);
      message.channel.send("Added LFG Role for you");
      SaveToDB(message.member);
    }
  },
};

function SaveToDB(member) {
  //DB LOGIC
  DbConnect.getConnection((err, con) => {
    if (err) throw err;
    var sql = `UPDATE members SET LFG = 1 WHERE UserID = ?;`;
    var values = [
      [member.user.id]
    ]
    con.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`${member.user.username} is LFG`)
    });
    con.release();
  })
}

function RemoveFromDB(member) {
  //DB LOGIC
  DbConnect.getConnection((err, con) => {
    if (err) throw err;
    var sql = `UPDATE members SET LFG = 0 WHERE UserID = ?;`;
    var values = [
      [member.user.id]
    ]
    con.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`${member.user.username} is LFG`)
    });
    con.release();
  })
}