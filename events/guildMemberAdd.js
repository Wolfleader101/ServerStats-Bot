const {
  client
} = require('../app');
const DbConnect = require('../DB/DbConnect')

//when member joins server
client.on('guildMemberAdd', member => {
  const guild = client.guilds.cache.get("445536297096839168");
  const general = guild.channels.cache.get("709336331091705879");
  general.send(`Welcome, ${member.user} to ${guild.name}!`);

  let NewRole = guild.roles.cache.find(role => role.name === "OCE Rust Community")
  if (!member.roles.cache.some(role => role.name === "OCE Rust Community")) {
    member.roles.add(NewRole).catch(console.error);
  }


  // DB LOGIC
  let username = member.user.tag;
  let userId = member.id;
  // DB LOGIC
  DbConnect.getConnection((err, con) => {
    if (err) throw err;
    var sql = `INSERT INTO Members (Username, UserID) VALUES ?`;
    var values = [
      [username, userId]
    ]

    con.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log("a user has joined");
    });
    con.release();
  })

});