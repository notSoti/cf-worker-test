import { measureDiscordApiLatency } from "../utils/discord.js";

export default {
	name: "ping",
	description: "Check whether cf-worker-test can reach Discord.",
	async execute(interaction, env) {
		const latency = await measureDiscordApiLatency(env.DISCORD_BOT_TOKEN);

		return `Pong! Discord API responded in ${latency} ms.`;
	},
};
