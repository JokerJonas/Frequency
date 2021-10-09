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
    name: 'help',
    aliases: ['?'],
    category: 'setting',
    description: 'show this message',
    execute(client, message, args, queue, invoke, prefix) {
    var standard_embed = new MessageEmbed()
        .setColor(0x2670fc)
        .setAuthor(`${client.user.username} - Help`, client.user.avatarURL())
        .setDescription(`
        🎵 \`»\` music commands

        ⚙️ \`»\` setting commands
        
        ✨ \`»\` informations
        
        🏠 \`»\` this page`)
    .setFooter(message.author.username, message.author.avatarURL())
    .setTimestamp()
    var music_embed = new MessageEmbed()
        .setColor(0x2670fc)
        .setAuthor(`${client.user.username} - Help - Music`, client.user.avatarURL())
        .setDescription('`()` = required Argument\n`[]` = none-required Argument')
        .setFooter(message.author.username, message.author.avatarURL())
        .setTimestamp()
    var setting_embed = new MessageEmbed()
        .setColor(0x2670fc)
        .setAuthor(`${client.user.username} - Help - Settings`, client.user.avatarURL())
        .setDescription('`()` = required Argument\n`[]` = none-required Argument')
        .setFooter(message.author.username, message.author.avatarURL())
        .setTimestamp();

    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    var info_embed = new MessageEmbed()
        .setColor(0x2670fc)
        .setAuthor(`${client.user.username} - Help - Informations`, client.user.avatarURL())
        .addField('uptime', `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes, \`${seconds}\` seconds`, false)
        .addField('prefix', `standard: \`${config.utils.prefix}\`, this server: \`${prefix}\``, false)
        .addField('servers', `${client.guilds.cache.size} server`, true)
        .addField('channels', `${client.channels.cache.size} channels`, true)
        .addField('users', `${client.users.cache.size} users`, true)

        .addField('invite', '[click here to invite](https://discord.com/api/oauth2/authorize?client_id=817450960028172338&permissions=334548240&scope=bot%20applications.commands)', false)
        .setFooter(message.author.username, message.author.avatarURL())
        .setTimestamp();

        
        client.commands.forEach((command) => {
            switch (command.category) {
                case 'setting': 
                    if(command.aliases) {
                        setting_embed.addField(prefix+command.name, `\`description\`: ${command.description}\n\`aliases\`: ${command.aliases.join(', ')}`)
                    } else {
                        setting_embed.addField(prefix+command.name, `\`description\`: ${command.description}`)
                    }
                    break;
                case 'music':
                    if(command.aliases) {
                        music_embed.addField(prefix+command.name, `\`description\`: ${command.description}\n\`aliases\`: ${command.aliases.join(', ')}`)
                    } else {
                        music_embed.addField(prefix+command.name, `\`description\`: ${command.description}`)
                    }
                    break;
            }
        })

        if (args[0]) {
            const command = client.commands.get(args[0].toLowerCase()) || client.aliases.get(args[0].toLowerCase());

            if (!command) {
                switch (args[0].toLowerCase()) {
                    case 'setting' || 'settings':
                        return help_menu(message, setting_embed, standard_embed, music_embed, setting_embed, info_embed);
                    case 'music':
                        return help_menu(message, music_embed, standard_embed, music_embed, setting_embed, info_embed);  
                    case 'info' || 'informations':
                        return help_menu(message, info_embed, standard_embed, music_embed, setting_embed, info_embed);
                    default: 
                        return help_menu(message, standard_embed, standard_embed, music_embed, setting_embed, info_embed);      
                }
            } else {
                var embed = new MessageEmbed()
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - Help`, client.user.avatarURL())
                    .setTitle(prefix+command.name)
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                if(command.aliases) {
                    embed.setDescription(`\`description\`: ${command.description}\n\`aliases\`: ${command.aliases.join(', ')}`)
                } else {
                    embed.setDescription(`\`description\`: ${command.description}`)
                }
                return message.reply(embed);
            }
        } else {
            help_menu(message, standard_embed, standard_embed, music_embed, setting_embed, info_embed);
        }
    }
}

function help_menu(message, embed, standard_embed, music_embed, setting_embed, info_embed) {
    message.reply(embed).then(msg => {
        msg.react('🎵')
        msg.react('⚙️')
        msg.react('✨')
        msg.react('🏠')

        const reactionFilter = (reaction, user) => ['🎵','⚙️','✨', '🏠'].includes(reaction.emoji.name) && (message.author.id === user.id)
        const collector = msg.createReactionCollector(reactionFilter);

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name){
                case '🎵':
                    reaction.users.remove(reaction.users.cache.filter(u => u === message.author).first());
                    return msg.edit(music_embed);
                case '⚙️':
                    reaction.users.remove(reaction.users.cache.filter(u => u === message.author).first());
                    return msg.edit(setting_embed);
                case '✨':
                    reaction.users.remove(reaction.users.cache.filter(u => u === message.author).first());
                    return msg.edit(info_embed);
                case '🏠':
                    reaction.users.remove(reaction.users.cache.filter(u => u === message.author).first());
                    return msg.edit(standard_embed);
            }
        })
    })
}