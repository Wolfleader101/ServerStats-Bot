const {
  Client,
  MessageEmbed
} = require("discord.js");
const config = require("../config.json");
const axios = require('axios')

axios.defaults.baseURL = 'https://rustmaps.com/api/public/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
module.exports = {
  name: "mapseed",
  cooldown: 5,
  execute(message, args) {
    const staff = message.member.roles.cache.some((role) => role.name == "Staff") ||
      message.member.hasPermission('ADMINISTRATOR'); // check for staff role to bypass restrictions

    if (staff) {
      SendPoll(message.member, message, args);
    } else {
      message.channel.send('You must be staff to perform this action')
    }
  },
};

async function SendPoll(member, message, args) {
  if (args[0] == null || args[1] == null || (args[2] == null) | (args[3] == null) || args[4] == null || args[5] == null || args[6] == null)
    return message.channel.send(
      "Please supply valid arguments... \n Correct Usage: `" + config.prefix + "mapseed <WorldSize> <Seed1> <Seed2> <Seed3> <Seed4> <Seed5> <Seed6>`"
    );

  const mapVoteChannel = message.guild.channels.cache.get(config["MapVoteChannel (ID)"]);


  var min24 = 60000 * 1;
  var hour24 = min24 * 60;
  var final = hour24 * 24;
  var before = final - 30000;

  let mapOneVotes;
  let mapTwoVotes;
  let mapThreeVotes;
  let mapFourVotes;
  let mapFiveVotes;
  let mapSixVotes;

  message.channel.send("Map Vote will be posted in <#" + config["MapVoteChannel (ID)"] + "> !")
  mapVoteChannel.send(await createEmbed(1, args[0], args[1])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapOneVotes = reaction.count;
        }
      }, before);
    });
  });

  mapVoteChannel.send(await createEmbed(2, args[0], args[2])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapTwoVotes = reaction.count;
        }
      }, before);
    });
  });

  mapVoteChannel.send(await createEmbed(3, args[0], args[3])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapThreeVotes = reaction.count;
        }
      }, before);
    });
  });

  mapVoteChannel.send(await createEmbed(4, args[0], args[4])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapFourVotes = reaction.count;
        }
      }, before);
    });
  });
  mapVoteChannel.send(await createEmbed(5, args[0], args[5])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapOneVotes = reaction.count;
        }
      }, before);
    });
  });
  mapVoteChannel.send(await createEmbed(6, args[0], args[6])).then((embedmsg) => {
    embedmsg.react("✅");
    embedmsg.react("❌");
    embedmsg.awaitReactions((reaction) => {
      setTimeout(() => {
        if (reaction.emoji.name === "✅") {
          mapOneVotes = reaction.count;
        }
      }, before);
    });
  });
  message.channel.send("Map Vote was sent in <#" + config["MapVoteChannel (ID)"] + ">");

  await delayCall(() => {
    ResultsEmbed(mapOneVotes, mapTwoVotes, mapThreeVotes, mapFourVotes, mapFiveVotes, mapSixVotes)
    setTimeout(() => {
      mapVoteChannel
        .bulkDelete(8)
        .then((del) => {
          console.log("Removed all messages from Map Vote Channel");
        })
        .catch(console.error);
    }, final);
  }, final)
}

async function createEmbed(number, worldsize, mapseed) {
  let mapData;
  const mapExists = await axios.get('/mapexists', {
    params: {
      seed: mapseed,
      size: worldsize,
      staging: false
    }
  })
  if (mapExists.data === true) {
    mapData = await GetMapData(worldsize, mapseed);

  } else if (mapExists.data === false) {
    const generating = await GenerateMap(worldsize, mapseed);
    if(generating.status == 200) {
      mapData = await delayCall(() => GetMapData(worldsize, mapseed), 100000)
    } else {
      return console.log(`could not generate map! Size:${worldsize} Seed:${mapseed}`)
    }
    

  }
  let embed = new MessageEmbed()
    .setTitle("Map " + number)
    .addField("Link:", `${mapData.url}`)
    .setImage(`${mapData.imageIconUrl}`);
  return mapData.url + '?embed=d_c_i';
}

function ResultsEmbed(embed1, embed2, embed3, embed4, embed5, embed6) {
  let embed = new MessageEmbed()
    .setTitle("Map Vote Results")
    .addField("Map 1:", embed1 + " Vote(s)")
    .addField("Map 2:", embed2 + " Vote(s)")
    .addField("Map 3:", embed3 + " Vote(s)")
    .addField("Map 4:", embed4 + " Vote(s)")
    .addField("Map 5:", embed5 + " Vote(s)")
    .addField("Map 6:", embed6 + " Vote(s)")
    .setThumbnail("https://i.imgur.com/FH8hkrw.png");
  return embed;
}

async function delayCall(promiseCallback, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      promiseCallback().then(res => {
        resolve(res)
      })
    }, ms);
  })
}

async function GetMapData(worldsize, mapseed) {
  return axios.get('/mapdata', {
    params: {
      seed: mapseed,
      size: worldsize,
      staging: false
    }
  }).then((res) => {
    return res.data;
  })
}

async function GenerateMap(worldsize, mapseed) {
  return axios.post('/requestmap',
  {
      "seed": parseInt(mapseed),
      "size": parseInt(worldsize),
      "staging": false
  }, 
  {
    headers: {
      'ApiKey': '4015a424-855e-4294-853c-861e4e0102ac',
      'Content-Type': 'application/json'
      
    }
  }
  ).then((res) => {
    return res;
  }).catch((err) => {
    console.error(err)
  })
}