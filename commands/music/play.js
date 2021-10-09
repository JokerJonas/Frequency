/*
    -> Require Modules
*/
const fs      = require('fs');
const Discord = require('discord.js');
const ytdl    = require('ytdl-core');
const ytpl    = require('ytpl');
const { YTSearcher } = require('ytsearcher');

/*
    -> Require Configs
*/
const config = require(`../../config.json`);
const colors = require(`../../colors.json`);
const guilds = require(`../../guilds.json`);

const ytsearcher = new YTSearcher({
    key: config.yttoken,
    revealed: true
});


/*
    -> Export
*/
let timer;
module.exports = {
    name: 'play',
    aliases: ['p', 'add'],
    category: 'music',
    description: 'start playing music or add a song to the queue',
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

        if (!args[0]) {
            var embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor(`${client.user.username} - Play`, client.user.avatarURL())
                .setDescription('Please specify a song!')
                .setFooter(message.author.username, message.author.avatarURL())
                .setTimestamp()
            return message.reply(embed);
        }

        const vc = message.member.voice.channel;
        if (!vc) {
            var embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor(`${client.user.username} - Play`, client.user.avatarURL())
                .setDescription('You have to be in a Voice-Channel to Perform this command!')
                .setFooter(message.author.username, message.author.avatarURL())
                .setTimestamp()
            return message.reply(embed);
        }

        let url = args.join('');
        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            await ytpl(url).then(async playlist => {
                message.channel.send(new Discord.MessageEmbed()
                        .setColor(0x2670fc)
                        .setTitle(`${playlist.title} added to the Queue`)
                        .setURL(playlist.url)
                        //.setThumbnail(playl.thumbnail)
                        .addField('Type:','Playlist', true)
                        .addField('Author:',`[${playlist.author.name}](${playlist.author.channel_url})`, true)
                        //.addField('Videos:',playl.numbers, true)
                        .addField('Views:',playlist.views, true)
                        .addField('Description:',playlist.description)
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                    )
                playlist.items.forEach(async item => {
                    await videoHandler(await ytdl.getInfo(item.shortUrl), message, vc, true, playlist)
                })
                
            })
        }
        else if (url.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)){
            return videoHandler(await ytdl.getInfo(url), message, vc)
        }
        else {
            let result = await ytsearcher.search(args.join(' '), {type: 'video'})
            if(!result.first) 
                return await message.channel.send('', new Discord.MessageEmbed()
                    .setColor(colors.red)
                    .setDescription('There are no results found')
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                );

            let songInfo = await ytdl.getInfo(result.first.url)
            return videoHandler(songInfo, message, vc)
        
        }

        async function videoHandler(songInfo, message, vc, playlist = false){
            clearTimeout(timer);
            const serverQueue = queue.get(message.guild.id);
            const song        = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: songInfo.videoDetails.lengthSeconds,
                author: songInfo.videoDetails.author,
                thumbnail: songInfo.videoDetails.thumbnails[3].url
            }

            if (!serverQueue){
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 4,
                    playing: true,
                    loopone: false,
                    loopall: false,
                    skipVotes: []
                };
                queue.set(message.guild.id, queueConstructor);
 
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await queueConstructor.vChannel.join()
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                }catch (err){
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send('', new Discord.MessageEmbed()
                        .setColor(colors.red)
                        .setDescription('I have no Permissions to join your Voice Channel!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                    )
                }
            }else{
                serverQueue.songs.push(song);
                
                if (serverQueue.songs.length === 1)
                    play(message.guild, serverQueue.songs[0])

                if(playlist) {
                    return undefined;
                }
                var minute = Math.floor((song.duration%3600) / 60);
                var second = Math.floor(song.duration%60);
                if(second < 10)
                    second = "0"+second;
                return message.channel.send(``, new Discord.MessageEmbed()
                    .setColor(0x2670fc)
                    .setTitle(`${song.title} added to the Queue`)
                    .setURL(song.url)
                    .setThumbnail(song.thumbnail)
                    .addField('Channel:',`[${song.author.name}](${song.author.channel_url})`, true)
                    .addField('Song duration:',`${minute}:${second}`, true)
                    .addField('Songs up to this one:',`${serverQueue.songs.length - 1} (include now playing)`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                );
            }
        }
        function play(guild, song){
            const serverQueue = queue.get(guild.id);
            if(!song){
                timer = setTimeout(function() {
                    serverQueue.vChannel.leave();
                    queue.delete(guild.id);
                }, 60000)
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on('finish', () =>{
                    if(serverQueue.loopone){
                        play(guild, serverQueue.songs[0]);
                    }else if(serverQueue.loopall){
                        serverQueue.songs.push(serverQueue.songs[0])
                        serverQueue.songs.shift();
                    }else{
                        serverQueue.songs.shift();
                    }
                    play(guild, serverQueue.songs[0]);
                })
            serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
        }
    }
}