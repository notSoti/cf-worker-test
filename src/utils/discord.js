const DISCORD_API_BASE = "https://discord.com/api/v10";

export async function editOriginalInteractionResponse(applicationId, token, content) {
	const response = await fetch(`${DISCORD_API_BASE}/webhooks/${applicationId}/${token}/messages/@original`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ content }),
	});

	if (!response.ok) {
		throw new Error(`Discord response edit failed with status ${response.status}`);
	}
}

export async function measureDiscordApiLatency(botToken) {
	const startedAt = performance.now();
	const response = await fetch(`${DISCORD_API_BASE}/gateway/bot`, {
		headers: {
			Authorization: `Bot ${botToken}`,
		},
	});
	const latency = Math.round(performance.now() - startedAt);

	if (!response.ok) {
		throw new Error(`Discord API health check failed with status ${response.status}`);
	}

	return latency;
}
