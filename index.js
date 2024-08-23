const { Client, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');
const prompt=require("prompt-sync")({sigint:true});

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

console.log(token);

async function scheduleEvent(name, startTime, endTime, description, imageUrl) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        const scheduledEvent = await guild.scheduledEvents.create({
            name: name,
            privacyLevel: 2,
            scheduledStartTime: startTime,
            scheduledEndTime: endTime,
            entityType: 3,
            entityMetadata: { location: "TEST"},
            description: description,
            image: imageBase64
        });

        const channel = await client.channels.fetch(process.env.CHANNEL_ID);
        await channel.send(`@everyone 🎉 A new event "${scheduledEvent.name}" has been scheduled! It will start on <t:${Math.floor(startTime.getTime() / 1000)}:F>.`);

        console.log("Event successfully scheduled!");

    } catch (error) {
        console.error("Error creating scheduled event: " + error);
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    let name = prompt("Name of event: ");
    let description = prompt("Provide description of event: ");
    const startTime = new Date('2024-08-26T15:00:00Z');
    const endTime = new Date('2024-08-26T16:00:00Z');

    // test image
    const imageUrl = "https://th.bing.com/th/id/R.b278428a21699d82d8bda5ecff4d3fba?rik=VCLWUCs8MAqrJw&pid=ImgRaw&r=0";

    scheduleEvent(name, startTime, endTime, description, imageUrl);
});

client.login(token);