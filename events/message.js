/*
    -> Require Modules
*/
const fs = require(`fs`);
const Discord = require(`discord.js`);


/*
    -> Require Configs
*/
const config = require(`../config.json`);
const colors = require(`../colors.json`);
const guilds = require(`../guilds.json`);


/*
    -> Export
*/
module.exports = (client, queue, ytsearcher, message) => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.type === `dm`) {
        var embed = new Discord.MessageEmbed()
            .setColor()
            .setDescription(`I'm glad you sent me a direct message, but I only work on servers. If you need help with my commands, you can click [here](https://frequency.zerodevs.de/commands.html). or type \`f!help\` in a server.`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()

        message.reply(embed);
        return;
    }

    if (!guilds[message.guild.id]) {
        guilds[message.guild.id] = {
            prefix: config.utils.prefix,
            usedj: false,
            djrole: null,
        }

        fs.writeFileSync(`./guilds.json`, JSON.stringify(guilds, null, 2));
    }

    const prefix = guilds[message.guild.id].prefix;

    if (message.mentions.users.first() === client.user && message.content.startsWith(client.user)) {
        var embed = new Discord.MessageEmbed()
            .setColor()
            .setDescription(`My prefix is \`${prefix}\` on this Server\nType \`${prefix}help\` for more information!`)
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
        message.reply(embed);
        return;
    }

    if (!message.content.startsWith(prefix)) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const invoke = args.shift().toLowerCase();

    const command = client.commands.get(invoke) || client.aliases.get(invoke);

    if (!command) {
        return;
    }

    command.execute(client, message, args, queue, invoke, prefix);
} 