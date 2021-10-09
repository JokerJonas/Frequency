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
    name: 'loop',
    aliases: ['l'],
    category: 'music',
    description: 'change the loop mode',
    execute(client, message, args, queue, invoke, prefix) {
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
        switch(args[0]){
            case 'all':
                serverQueue.loopall = !serverQueue.loopall;
                serverQueue.loopone = false;

                if(serverQueue.loopall === true)
                    message.channel.send('', new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setDescription('Loop all has been turned on!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                else
                    message.channel.send('', new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setDescription('Loop all has been turned off!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                break;
            case 'one':
                serverQueue.loopone = !serverQueue.loopone;
                serverQueue.loopall = false;

                if(serverQueue.loopone === true)
                    message.channel.send('', new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setDescription('Loop one has been turned on!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                else
                    message.channel.send('', new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setDescription('Loop one has been turned off!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                break;
            case 'off':
                serverQueue.loopall = false;
                serverQueue.loopone = false;
                message.channel.send('', new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setDescription('Loop has been turned off!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                break;
            default:
                message.channel.send(new Discord.MessageEmbed()
                    .setColor(0x2670fc)
                    .setDescription('Pleas specify what loop you want. \n`'+prefix+'loop [one/all/off]`')
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                )
        }
    }
}