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
    name: 'voteeskip',
    aliases: ['skip', 'vs'],
    category: 'music',
    description: 'vote for skiping the currently playing song',
    async execute(client, message, args, queue, ytsearcher, invoke, prefix) {
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
        let users = message.member.voice.channel.members.size -1;
        let req   = Math.ceil(users/2)

        if(serverQueue.skipVotes.includes(message.member.id))
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('You already voted for skip!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        
        serverQueue.skipVotes.push(message.member.id)

        if(serverQueue.skipVotes.length >= req) {
            serverQueue.connection.dispatcher.end();
            serverQueue.skipVotes = [];
            message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription(`You voted to skip the song! **Song has been skipped**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        } else {
            message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription(`You voted to skip the song! **${serverQueue.skipVotes.length}/${req} Voted**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        }
    }
}