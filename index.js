
import dotenv from 'dotenv';
dotenv.config();
import { Client, Events, GatewayIntentBits, PermissionsBitField } from 'discord.js';
import axios from 'axios';

const OPENAI_API_KEY = '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';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  
  ],
});


client.on(Events.ClientReady, readyClient => {
  console.log(`${readyClient.user.tag}! is online`);
  const channelId = '1326169361311989812';
  const channel = client.channels.cache.get(channelId);

  /*if (channel && channel.isTextBased()) {
    channel.send('👋 Hello!! This is **Begin**. 🤖 "I AM A BOT", currently in **creation mode**! 🚀\n\n' +
  '🌟 I would love it if you could introduce yourself here! 🙌\n' +
  '✨ Have a fantastic day! 😊');
  } else {
    console.error('Channel not found or is not text-based.');
  }*/
});

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;

    
    if (message.content === 'hi begin') {
      message.reply('hey buddy!!');
    }

    if (message.content === 'who is gaurav'){
      message.reply('Gaurav 👑 is the owner and founder of the Begin community🚀');
    }


    if (message.content === 'userinfo') {
      message.reply(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
  
    if (message.content === 'serverinfo') {
      message.reply(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
    
    if (message.content.startsWith('!clear')) {
      const args = message.content.split(' ');
  
      // Ensure the user specifies a number
      if (args.length < 2 || isNaN(args[1])) {
        return message.reply('Please specify the number of messages to delete, e.g., `!clear 10`.');
      }
  
      const amount = parseInt(args[1]);
  
      if (amount < 1 || amount > 100) {
        return message.reply('You can delete between 1 and 100 messages at a time.');
      }
  
      // Check if the bot has the necessary permissions
      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply("I don't have permission to delete messages.");
      }
  
      try {
        // Bulk delete messages
        const deletedMessages = await message.channel.bulkDelete(amount, true);
        await message.channel.send(`Deleted ${deletedMessages.size} messages.`).then((msg) => {
          setTimeout(() => msg.delete(), 5000); // Auto-delete the confirmation message
        });
      } catch (error) {
        console.error(error);
        message.reply('An error occurred while trying to delete messages.');
      }
    }

    if (message.content.startsWith('?ask')) {
      const query = message.content.replace('?ask', '').trim();
      if (!query) {
        return message.reply('Please provide a question or topic, e.g., `?ask What is AI?`.');
      }
  
      try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            format: 'json',
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            titles: query,
            redirects: 1,
          },
        });
  
        const pages = response.data.query.pages;
        const page = Object.values(pages)[0];
  
        if (!page || page.missing) {
          return message.reply(`I couldn't find information on "${query}". Try rephrasing or asking about something else.`);
        }
  
        const summary = page.extract || 'No information available. Try another query.';
        const maxLength = 2000;
  
        // Check if the message exceeds Discord's limit
        if (summary.length > maxLength) {
          const parts = [];
          let remainingText = summary;
  
          while (remainingText.length > 0) {
            parts.push(remainingText.slice(0, maxLength));
            remainingText = remainingText.slice(maxLength);
          }
  
          for (const part of parts) {
            await message.channel.send(part);
          }
        } else {
          message.reply(summary);
        }
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        message.reply('I encountered an error while trying to fetch the information. Please try again later.');
      }
    }



  });




client.on(Events.InteractionCreate, async interaction => {
  
  if (!interaction.isChatInputCommand()) return;
  
  const { commandName } = interaction;

  if (commandName === 'botinfo'){
    await interaction.reply('NAME: BEGIN 🤖\nCREATION-STATUS: STILL IN CREATION!! 🔧\nVERSION: 1.0.0 📦\nLANGUAGES USED: JAVASCRIPT, NODE.JS, DISCORD.JS 💻\nCURRENT-DEVELOPER: GAURAV 👨‍💻\nSERVER: BEGIN 💬\nFEATURES:\n- CAN REPLY TO TEXT LIKE `hey begin` 💬\n- `userinfo` 👤\n- `serverinfo` 🖥️\n- ONE ADDITIONAL: `who is gaurav` 👀\n- CAN TELL JOKE USE `/joke` 😂\n- CAN CLEAR MESSAGES IN BULK (DO NOT USE) 🧹\n- CAN GIVE BIT INFORMATION USE `?ask` 💡');
  }

  if (commandName === 'joke') {
    try {
      // Fetch a random joke from JokeAPI
      const response = await fetch('https://v2.jokeapi.dev/joke/Any');
      const jokeData = await response.json();

      let joke;
      if (jokeData.type === 'single') {
        joke = jokeData.joke; // Single-line joke
      } else {
        joke = `${jokeData.setup}\n\n${jokeData.delivery}`; // Setup and punchline
      }

      await interaction.reply(joke);
    } catch (error) {
      console.error('Error fetching joke:', error);
      await interaction.reply('Oops! I couldn\'t fetch a joke right now. Try again later!');
    }
  }



});



client.login(process.env.TOKEN);
