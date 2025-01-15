import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'joke',
    description: 'Sends a random joke',
  },

  {
    name: 'botinfo',
    description: 'tell us about bot',
  },


];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Clearing guild commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('Cleared guild commands.');

    // Register only the new commands
    console.log('Registering new commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully registered new commands.');
  } catch (error) {
    console.error(error);
  }
})();

/*(async () => {
  try {
    console.log('Fetching global commands...');
    const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
    console.log('Global Commands:', globalCommands);

    console.log('Fetching guild commands...');
    const guildCommands = await rest.get(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
    );
    console.log('Guild Commands:', guildCommands);

    console.log('Clearing global commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
    console.log('Cleared global commands.');

    console.log('Clearing guild commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );
    console.log('Cleared guild commands.');
  } catch (error) {
    console.error('Error clearing commands:', error);
  }
})();*/