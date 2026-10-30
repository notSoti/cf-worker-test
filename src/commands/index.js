import ping from "./ping.js";

export const commands = [ping];
export const commandsByName = new Map(commands.map((command) => [command.name, command]));
export const commandDefinitions = commands.map(({ name, description }) => ({
	name,
	description,
	type: 1,
	// Manage Server permission
	default_member_permissions: "32",
}));

