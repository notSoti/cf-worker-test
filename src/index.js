import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { commandsByName } from "./commands/index.js";
import { editOriginalInteractionResponse } from "./utils/discord.js";

function interactionResponse(type, data) {
	return new Response(JSON.stringify({ type, ...(data ? { data } : {}) }), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export default {
	async fetch(request, env, executionCtx) {
		if (request.method !== "POST") {
			return new Response("Not found", { status: 404 });
		}

		const body = await request.text();

		const signature = request.headers.get("X-Signature-Ed25519");
		const timestamp = request.headers.get("X-Signature-Timestamp");

		if (!await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)) {
			return new Response("Invalid request signature", { status: 401 });
		}

		let interaction;

		try {
			interaction = JSON.parse(body);
		}
		catch {
			return new Response("Invalid interaction payload", { status: 400 });
		}

		if (interaction.type === InteractionType.PING) {
			return interactionResponse(InteractionResponseType.PONG);
		}

		if (interaction.type !== InteractionType.APPLICATION_COMMAND || interaction.data?.type !== 1) {
			return interactionResponse(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, {
				content: "This interaction is not supported.",
				flags: 64,
			});
		}

		const command = commandsByName.get(interaction.data.name);

		if (!command) {
			return interactionResponse(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, {
				content: "Unknown command.",
				flags: 64,
			});
		}

		const deferred = interactionResponse(InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
		const completion = command.execute(interaction, env)
			.then((content) => editOriginalInteractionResponse(env.DISCORD_APPLICATION_ID, interaction.token, content))
			.catch((error) => {
				console.error(`Command ${command.name} failed:`, error);
				return editOriginalInteractionResponse(
					env.DISCORD_APPLICATION_ID,
					interaction.token,
					"The command failed. Please try again later.",
				);
			});

		if (executionCtx) {
			executionCtx.waitUntil(completion);
		}
		else {
			await completion;
		}

		return deferred;
	},
};
