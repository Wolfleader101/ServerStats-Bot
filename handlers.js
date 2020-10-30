// Needed for handlers
const fs = require('fs');

module.exports = (client) => {
/* ===== COMMAND HANDLER ===== */

// Get files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Loop over files and import them
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});
/* =========================  */

/* ===== EVENT HANDLER ===== */

// Get files
const EventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Loop over files and import them
EventFiles.forEach(file => {
    require(`./events/${file}`);
});
/* =========================  */
}

