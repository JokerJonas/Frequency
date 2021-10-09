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
    name: 'forceskip',
    aliases: ['fs'],
    category: 'music',
    description: 'forceskip the currently playning song',
    async execute(client, message, args, queue, ytsearcher, invoke, prefix) {
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
        } else if (!message.member.hasPermission('MUTE_MEMBERS')) {
                var embed = new Discord.MessageEmbed()
                    .setColor(0x2670fc)
                    .setAuthor(`${client.user.username} - DJ`, client.user.avatarURL())
                    .setDescription('You don\'t have permission to perform this command!')
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setTimestamp()
                return message.reply(embed);
        }

        const serverQueue = queue.get(message.guild.id)
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('You need to join the voice chat first!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        if(!serverQueue)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('There is nothing to skip!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        serverQueue.connection.dispatcher.end();
        serverQueue.skipVotes = [];
        message.channel.send('', new Discord.MessageEmbed()
            .setColor(0x2670fc)
            .setDescription('Song has been skiped!\n__Note:__\n*If there is no song to play I stop playing music*')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        )
    }
}