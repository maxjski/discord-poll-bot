# Simple Poll Bot for Discord
This project is a simple poll bot created for Discord to add images to polls. Utilizing the Discord.js library, this bot allows users to create image-enhanced polls within their Discord servers.

## Requirements
- Node.js v18.16.0
- npm 9.5.1

Make sure you have the required versions of Node.js and npm installed. If you need to install them, you can find instructions on the official [Node.js website](https://nodejs.org/en).

## Setup

1. **Clone the Repository**

```bash
git clone https://github.com/maxjski/discord-poll-bot.git
cd discord-poll-bot
```
2. **Install Dependencies**

```bash
npm install
```

3. **Configure the Bot**

Create a `config.json` file in the root directory with the following structure:

```json
{
  "token": "your-bot-token-here",
  "clientId": "your-client-id-here",
  "guildId": "your-guild-id-here"
}
```

You will need to set up a Discord bot application and retrieve the token, client ID, and guild ID. You can follow the [official Discord guide](https://discord.com/developers/docs/intro) to create a bot user and obtain these values.

## Usage
1. **Deploy the Bot Commands**

```bash
node deploy-commands.js
```

2. **Run the Bot**

```bash
node index.js
```
The bot should now be up and running.

## License

This project is licensed under the MIT License.