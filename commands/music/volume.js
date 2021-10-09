/*
    -> Require Modules
*/
const fs      = require('fs');
const Discord = require('discord.js');
const ytdl    = require('ytdl-core');
const ytpl    = require('ytpl');


/*
    -> Require Configs
*/
const config = require(`../../config.json`);
const colors = require(`../../colors.json`);
const guilds = require(`../../guilds.json`);




/*
    -> Export
*/
let timer;
module.exports = {
    name: 'volume',
    aliases: ['v'],
    category: 'music',
    description: 'change the volume for all users in the server',
    async execute(client, message, args, queue, invoke, prefix) {
        if(guilds[message.guild.id].usedj) {
            if (!message.member.roles.cache.get(guilds[message.guild.id].djrole)) {
                var embed = new Discord.MessageEmbed()
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                    .setDescription('You don\'t have the DJ role to perform this command!')
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                return message.reply(embed);
            }
        }

        const serverQueue = queue.get(message.guild.id)
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('You are not in the voice channel!') 
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            )
        if(!serverQueue)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('There is no music currently playing!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            )
        if(!args[0])
            return message.channel.send('', new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setTitle('Volume:')
                .setDescription('The volume is: `'+serverQueue.volume+ '`')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            )
        if(isNaN(args[0]))
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('That is not a valid amount to change the volume!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        if(args[0] > 10 || args[0]< 1)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('That is not a valid amount to change the volume, only `1` to `10`!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        serverQueue.volume = args[0]
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
        message.channel.send('', new Discord.MessageEmbed()
            .setColor(0x2670fc)
            .setTitle('Volume:')
            .setDescription("The volume has been changed to: `"+ serverQueue.volume+ '`')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        )
    }
}