const package = require('../package.json')

const {
  client
} = require('../app')
const chalk = require('chalk');
const config = require('../config.json')
const {Server} = require('battle-wrapper')

// The startup event
client.on('ready', () => {
  console.log('\n=====================================\n');
  console.log('   --', chalk.red(' Server Stats Bot Working '), '--');
  console.log('   --       Status:', chalk.green('Online   '), '   --\n');
  console.log('=====================================');
  setInterval(() => {
    Server.GetServerPlayerCount(config.serverID).then((res) => {
      client.user.setActivity(`${res.Population} Online`, {type: 'PLAYING'})
    })
  }, 10000) // every 10 seconds


});