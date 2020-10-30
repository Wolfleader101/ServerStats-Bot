const {
  client
} = require('../app');

// This is not working!

//logs Member update e.g roles
// client.on('guildMemberUpdate', (oMember, nMember) => {
//   console.log(ddiff(oMember, nMember));
// });

// //guild update very specific e.g changing verification level
// client.on('guildUpdate', (oGuild, nGuild) => {
//   console.log(ddiff(oGuild, nGuild));
// });