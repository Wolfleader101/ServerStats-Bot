function rand() {
    let roll = Math.floor(Math.random() * 6) + 1;
    return roll;
}
module.exports = {
    name: 'rtd',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Rolling Die!').then(sent => {
            sent.edit(`**.**`)
            sent.edit(`**..**`)
            sent.edit(`**...**`)
            sent.edit(`you rolled a **${rand()}** :game_die:`);
        });
    },
};