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
        const guild = await client.guilds.fetch("1270871231133913228");

        const scheduledEvent = await guild.scheduledEvents.create({
            name: name,
            privacyLevel: 2,
            scheduledStartTime: startTime,
            scheduledEndTime: endTime,
            entityType: 3,
            entityMetadata: { location: "TEST"},
            description: description
        });

        console.log("Event scheduled");

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