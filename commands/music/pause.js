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
    name: 'pause',
    aliases: ['pa', 'pau','stop'],
    category: 'music',
    description: 'pause the currently playing music',
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
        if(!serverQueue)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('There is no music currently playing!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('You are not in the voice channel!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        if(serverQueue.connection.dispatcher.paused)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('The song is already paused')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        serverQueue.connection.dispatcher.pause();
        message.channel.send('', new Discord.MessageEmbed()
            .setColor(0x2670fc)
            .setDescription('The song has been paused!')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        )
    }
}