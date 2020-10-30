function rand() {
    let roll = Math.floor(Math.random() * 2) + 1;
    switch (roll) {
        case 1:
            return "Heads";
        case 2:
            return "Tails";
        default:
            break;
    }
}
module.exports = {
    name: 'coinflip',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('__').then(sent => {
            sent.edit('\\')
            sent.edit(`|`)
            sent.edit(`/`)
            sent.edit(`__`)
            sent.edit(`**${rand()}**!`);
        });
    },
};