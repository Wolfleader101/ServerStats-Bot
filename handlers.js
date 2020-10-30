// Needed for handlers
const fs = require('fs');

module.exports = (client) => {
/* ===== EVENT HANDLER ===== */

// Get files
const EventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Loop over files and import them
EventFiles.forEach(file => {
    require(`./events/${file}`);
});
/* =========================  */
}

