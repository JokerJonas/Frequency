///////////////////////////////////////////////////////
//            Frequency Index Bot Code               //
///////////////////////////////////////////////////////


/*
    -> Require Modules
*/
const fs = require(`fs`);
const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);
const { YTSearch } = require(`ytsearcher`);


/*
    -> Require JSONs
*/
const config = require(`./config.json`);
const colors = require(`./colors.json`);


/*
    -> YouTube Searcher
*/
const ytsearcher = new YTSearch(config.yttoken)


/*
    -> Discord Client
*/
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.aliases  = new Discord.Collection();

/*
    -> Queue Map
*/
const queue = new Map();


/*
    -> Loading Events
*/
console.log(`―――――――――――――――――――――――――――――――`);
console.log(`│loading Events:              │`);
console.log(`―――――――――――――――――――――――――――――――`);

const eventDIR = fs.readdirSync(`./events`).filter(file => file.endsWith(`.js`));

for (const eventFILE of eventDIR) {
    const eventNAME = eventFILE.split(`.`)[0];
    const event = require(`./events/${eventFILE}`);
    client.on(eventNAME, event.bind(null, client, queue, ytsearcher));
    delete require.cache[require.resolve(`./events/${eventFILE}`)];

    console.log(`${eventNAME} loaded!`)
}


/*
    -> Loading Commands
*/
console.log(`―――――――――――――――――――――――――――――――`);
console.log(`│loading Commands:            │`);
console.log(`―――――――――――――――――――――――――――――――`);

const commandDIRs = fs.readdirSync(`./commands`);

for (const commandDIR of commandDIRs) {
    const commandFOLDER = fs.readdirSync(`./commands/${commandDIR}`).filter(file => file.endsWith(`.js`));

    for (const commandFILE of commandFOLDER) {
        const command = require(`./commands/${commandDIR}/${commandFILE}`);
        client.commands.set(command.name, command);

        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.aliases.set(alias, command);
            })
        }

        console.log(`${command.name} loaded!`)
    }
}


/*
    -> Client login
*/
client.login(config.dctoken);