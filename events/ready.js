/*
    -> Require Modules
*/


/*
    -> Require Configs
*/


/*
    -> Export
*/
module.exports = (client) => {
    console.log(`―――――――――――――――――――――――――――――――`);
    console.log(`│Client ready:                │`);
    console.log(`―――――――――――――――――――――――――――――――`);
    console.log(`Name:     ${client.user.username}`);
    console.log(`ID:       ${client.user.id}`);
    console.log(`Guilds:   ${client.guilds.cache.size}`);
    console.log(`Users:    ${client.users.cache.size}`);
    console.log(`Channels: ${client.channels.cache.size}`)
} 