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
    name: 'reload',
    aliases: ['restart'],
    async execute(client, message, args, queue, invoke, prefix) {
        if(message.author.id != config.utils.ownerID) return
        if (!args[0]) {
            client.commands.forEach((command) => {
                delete require.cache[require.resolve(`./${command.name}.js`)];
                const newCommand = require(`./${command.name}.js`);
                client.commands.set(newCommand.name, newCommand);
                console.log('Command reloaded: '+ newCommand.name);
            })
            console.log('------------------------------------');
            var embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor('Command reloaded:', colors.img.yes)
                .setDescription(`All commands reloaded successfully!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            message.reply(embed)
            return;
        }
        const command = client.commands.get(args[0].toLowerCase()) || client.aliases.get(args[0].toLowerCase());
        if (!command) {
            var embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor('Wrong Argument:')
                .setDescription(`There is no command with name or alias \`${args[0]}\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            return message.reply(embed)
        }
        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {
            const newCommand = require(`./${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            console.log('Command reloaded: '+ newCommand.name);
            console.log('------------------------------------');
            var embed = new Discord.MessageEmbed()
                .setColor(0x2670fc)
                .setAuthor('Command reloaded:')
                .setDescription(`\`${command.name}\` reloaded successfully!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            message.reply(embed)
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}