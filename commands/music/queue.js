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
    name: 'queue',
    aliases: ['q'],
    category: 'music',
    description: 'show the queue',
    async execute(client, message, args, queue, invoke, prefix) {
        const serverQueue = queue.get(message.guild.id)
        if(!serverQueue)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setDescription('There is no music currently playing!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("", new Discord.MessageEmbed()
                .setColor(colors.red)
                .setDescription('You are not in the voice channel!')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            )
        let nowPlaying = serverQueue.songs[0];
        if (!nowPlaying) {
            let embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setTitle('Queue:')
                .addField('Now playing:', 'Nothing')
                .setDescription()
            return message.reply(embed);
        }
        let qMsg = new Discord.MessageEmbed()
            .setColor(0x2670fc)
            .setTitle('Queue:')
            .addField('Now playing:', `[${nowPlaying.title}](${nowPlaying.url})`)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        if(serverQueue.songs.length >10){
            for(var i =1; i < 10; i++){
                qMsg.addField(`${i}.`,`[${serverQueue.songs[i].title}](${serverQueue.songs[i].url})`)
            }
            qMsg.addField(serverQueue.songs.length - 10, 'more')
        } else {
            for(var i =1; i < serverQueue.songs.length; i++){
                qMsg.addField(`${i}.`,`[${serverQueue.songs[i].title}](${serverQueue.songs[i].url})`)
            }
        }
        message.channel.send(qMsg)
    }
}