const { Client, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

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

async function scheduleEvent(name, startTime, endTime, description) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);

        const scheduledEvent = await guild.scheduledEvents.create({
            name: name,
            privacyLevel: 2,
            scheduledStartTime: startTime,
            scheduledEndTime: endTime,
            entityType: 3,
            entityMetadata: { location: "TEST"},
            description: description
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

    const name = "Community Event";
    const description = "Urgent Community Event";
    const startTime = new Date('2024-08-26T15:00:00Z');
    const endTime = new Date('2024-08-26T16:00:00Z');

    scheduleEvent(name, startTime, endTime, description);
});

client.login(token);