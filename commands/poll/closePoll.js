const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closepoll')
    .setDescription('Close a Poll')
    .addStringOption(option =>
      option.setName('pollid')
        .setDescription('The ID of the poll you want to close')),
  async execute(interaction) {
    const pollId = interaction.options.getString('pollid');
    const channelId = interaction.channelId;

    try {
      // Fetch the channel using the channel ID
      const channel = await interaction.client.channels.fetch(channelId);

      // Fetch the message using the poll ID (message ID)
      const message = await channel.messages.fetch(pollId);

      const closedEmbed = new EmbedBuilder()
        .setTitle('CLOSED');

      // Edit the message content
      await message.edit({ embeds: [closedEmbed] });

      // Optionally, you can send a reply to inform the user that the poll was closed
      await interaction.reply('Poll closed successfully!');
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while closing the poll.');
    }
  },
};