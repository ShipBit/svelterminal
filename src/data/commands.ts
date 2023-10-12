export interface Command {
	command: string;
	aliases?: string[];
	description: string;
	arguments?: CommandArgument[];
	execute?: (...args: string[]) => void;
}

export interface CommandArgument {
	name: string;
	description: string;
	required: boolean;
	type: 'string' | 'number' | 'boolean';
}

export const HELP_COMMAND: Command = {
	command: 'help',
	aliases: ['h', 'wtf', '?'],
	description: 'Show a list of all commands'
};

export const CLEAR_COMMAND: Command = {
	command: 'clear',
	description: 'Clear the terminal',
	aliases: ['c', 'clr', 'cls']
};

export const ABOUT_COMMAND: Command = {
	command: 'about',
	description: 'Meet my maker',
	aliases: ['shipbit']
};
