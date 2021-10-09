/*
    -> Require Modules
*/
const fs = require('fs');
const { MessageEmbed } = require('discord.js');


/*
    -> Require Configs
*/
const config = require(`../../config.json`);
const colors = require(`../../colors.json`);
const guilds = require(`../../guilds.json`);




/*
    -> Export
*/
module.exports = {
    name: 'prefix',
    aliases: ['setprefix'],
    category: 'setting',
    description: 'change te prefix of the bot in your server',
    execute(client, message, args, queue, invoke, prefix) {
        if (args[0]) {
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                var embed = new MessageEmbed()
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - Prefix`, client.user.avatarURL())
                    .setDescription('You need the Permission `ADMINISTRATOR` to perform this command!')
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                return message.reply(embed);
            } else {
                try {
                    guilds[message.guild.id].prefix = args[0];
                    fs.writeFileSync(`./guilds.json`, JSON.stringify(guilds, null, 2));
                    var embed = new MessageEmbed()
                        .setColor(0x2670fc)
                        .setAuthor(`${client.user.username} - Prefix`, client.user.avatarURL())
                        .setDescription(`The prefix was set to \`${guilds[message.guild.id].prefix}\``)
                        .setFooter(message.author.username, message.author.avatarURL())
                        .setTimestamp()
                    return message.reply(embed);
                } catch {
                    var embed = new MessageEmbed()
                        .setColor(0x2670fc)
                        .setAuthor(`${client.user.username} - Prefix`, client.user.avatarURL())
                        .setDescription('Something went wrong! Try again later!\nIf it still doesn\'t work, please report this with '+prefix+'report (message)')
                        .setFooter(message.author.username, message.author.avatarURL())
                        .setTimestamp()
                    return message.reply(embed);
                }
            }
        } else {
            var embed = new MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor(`${client.user.username} - Prefix`, client.user.avatarURL())
                .setDescription(`The prefix in this server is \`${prefix}\`, by default it's \`${config.utils.prefix}\`\nto change it type \`${prefix}prefix [your prefix]\``)
                .setFooter(message.author.username, message.author.avatarURL())
                .setTimestamp()
            return message.reply(embed);
        }
    }
}