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
    name: 'dj',
    aliases: ['moderator', 'mod'],
    category: 'setting',
    description: 'enable or disable the DJ-Function in your server',
    execute(client, message, args, queue, invoke, prefix) {
        if (!args[0]) {
            var embed = new MessageEmbed()
            if (guilds[message.guild.id].usedj) {
                embed
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                    .setDescription(`The DJ-Function is enabled in this Server!\nrole: <@&${guilds[message.guild.id].djrole}>\nid: \`${guilds[message.guild.id].djrole}\``)
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
            } else {
                embed
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                    .setDescription(`The DJ-Function is disabled in this Server!\n Type \`${prefix}dj enable (role)\` to enable the DJ-Function!`)
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
            }
            return message.reply(embed);
        } else {
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                var embed = new MessageEmbed()
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                    .setDescription('You need the Permission `ADMINISTRATOR` to perform this command!')
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                return message.reply(embed);
            }
            switch (args[0].toLowerCase()) {
                case 'enable':
                    if (guilds[message.guild.id].usedj) {
                        var embed = new MessageEmbed()
                            .setColor(0x2670fc)
                            .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                            .setDescription('The DJ-Function is already enabled!')
                            .setFooter(message.author.username, message.author.avatarURL())
                            .setTimestamp()
                        return message.reply(embed);
                    }

                    if (args[1]) {
                        var role;
                        if(message.mentions.roles.first()) {
                            role = message.mentions.roles.first();
                        } else {
                            try {
                                role = message.guild.roles.cache.get(args[1])
                            } catch {
                                var embed = new MessageEmbed()
                                    .setColor(0x2670fc)
                                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                                    .setDescription('use `'+prefix+'dj enable (role)`')
                                    .setFooter(message.author.username, message.author.avatarURL())
                                    .setTimestamp()
                                return message.reply(embed);
                            }
                        }
                        try {
                            guilds[message.guild.id].usedj = true;
                            guilds[message.guild.id].djrole = role.id;
                            fs.writeFileSync(`./guilds.json`, JSON.stringify(guilds, null, 2));

                            var embed = new MessageEmbed()
                                .setColor(0x2670fc)
                                .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                                .setDescription(`The DJ-Funktion has been enabeld in your Server.\nrole: ${role}\nid: \`${role.id}\``)
                                .setFooter(message.author.username, message.author.avatarURL())
                                .setTimestamp()
                            return message.reply(embed);
                        } catch {
                            var embed = new MessageEmbed()
                                .setColor(0x2670fc)
                                .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                                .setDescription('Something went wrong! Try again later!\nIf it still doesn\'t work, please report this with '+prefix+'report (message)')
                                .setFooter(message.author.username, message.author.avatarURL())
                                .setTimestamp()
                            return message.reply(embed);
                        }

                    } else {
                        var embed = new MessageEmbed()
                        if (guilds[message.guild.id].usedj) {
                            embed
                                .setColor(0x2670fc)
                                .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                                .setDescription(`The DJ-Function is enabled in this Server!\nrole: <@&${guilds[message.guild.id].djrole}>\nid: \`${guilds[message.guild.id].djrole}\``)
                                .setFooter(message.author.username, message.author.avatarURL())
                                .setTimestamp()
                        } else {
                            embed
                                .setColor(0x2670fc)
                                .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                                .setDescription(`The DJ-Function is disabled in this Server!\n Type \`${prefix}dj enable (role)\` to enable the DJ-Function!`)
                                .setFooter(message.author.username, message.author.avatarURL())
                                .setTimestamp()
                        }
                        return message.reply(embed);
                    }
                case 'disable':
                    if (!guilds[message.guild.id].usedj) {
                        var embed = new MessageEmbed()
                            .setColor(0x2670fc)
                            .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                            .setDescription('The DJ-Function is already disabled!')
                            .setFooter(message.author.username, message.author.avatarURL())
                            .setTimestamp()
                        return message.reply(embed);
                    }
                    try {
                        guilds[message.guild.id].usedj = false;
                        guilds[message.guild.id].djrole = null;

                        fs.writeFileSync(`./guilds.json`, JSON.stringify(guilds, null, 2));

                        var embed = new MessageEmbed()
                            .setColor(0x2670fc)
                            .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                            .setDescription(`The DJ-Funktion has been disabeld in your Server.`)
                            .setFooter(message.author.username, message.author.avatarURL())
                            .setTimestamp()
                        return message.reply(embed);
                    } catch {
                        var embed = new MessageEmbed()
                            .setColor(0x2670fc)
                            .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                            .setDescription('Something went wrong! Try again later!\nIf it still doesn\'t work, please report this with '+prefix+'report (message)')
                            .setFooter(message.author.username, message.author.avatarURL())
                            .setTimestamp()
                        return message.reply(embed);
                    }
            }
        }
    }
}