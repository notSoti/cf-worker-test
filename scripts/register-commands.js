import { commandDefinitions } from "../src/commands/index.js";

const applicationId = process.env.DISCORD_APPLICATION_ID;
const botToken = process.env.DISCORD_BOT_TOKEN;

if (!applicationId || !botToken) {
	throw new Error("DISCORD_APPLICATION_ID and DISCORD_BOT_TOKEN must be set.");
}

const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
	method: "PUT",
	headers: {
		Authorization: `Bot ${botToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify(commandDefinitions),
});

if (!response.ok) {
	throw new Error(`Command registration failed (${response.status}): ${await response.text()}`);
}

console.log(`Registered ${commandDefinitions.length} global command(s).`);
