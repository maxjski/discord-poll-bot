const { SlashCommandBuilder, EmbedBuilder} = require('discord.js'); // Notice the change from EmbedBuilder to MessageEmbed

function loadingBars(values) {
  let max = Math.max(...values);
  if (max === 0) max = 1; // avoid division by zero
  const barLength = 10; // length of the loading bar
  const result = [];

  values.forEach(value => {
    const percentage = (value / max) * 100;
    const filledLength = Math.round((value / max) * barLength);
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(barLength - filledLength);
    result.push(`${filled}${empty} ${percentage.toFixed(0)}%`);
  });

  return result;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closepoll')
    .setDescription('Close a Poll')
    .addStringOption(option =>
      option.setName('pollid')
        .setDescription('The ID of the poll you want to close')
        .setRequired(true)),
  async execute(interaction) {
    const pollId = interaction.options.getString('pollid');
    const channelId = interaction.channelId;

    await interaction.deferReply({ ephemeral: true });

    try {
      // Fetch the channel using the channel ID
      const channel = await interaction.client.channels.fetch(channelId);

      // Fetch the message using the poll ID (message ID)
      const message = await channel.messages.fetch(pollId);

      // Assuming that the message contains one embed and you want to extract the fields from it
      const originalEmbed = message.embeds[0];

      // Extract the 'Question' and 'Choices' fields
      const questionField = originalEmbed.fields.find(field => field.name === 'Question');
      const choicesField = originalEmbed.fields.find(field => field.name === 'Choices');
      const imageUrl = originalEmbed.image ? originalEmbed.image.url : null; // Get the image URL if it exists

      // Here you collect the reactions and format them as you want
      const reactionEmojis = [];
      const reactionCounts = [];
      message.reactions.cache.forEach((reaction) => {
        reactionEmojis.push(reaction.emoji);
        reactionCounts.push(reaction.count - 1);
      });

      const percentages = loadingBars(reactionCounts);
      const pollResults = [];
      for (let i = 0; i < reactionEmojis.length; i++) {
        pollResults.push(`${reactionEmojis[i]} ${percentages[i]}`);
      }

      // Create the modified embed with the extracted fields and new information
      const closedEmbed = new EmbedBuilder() // Change this according to your version of discord.js
        .setTitle(originalEmbed.title) // Keep original title
        .addFields(
          { name: questionField.name, value: questionField.value },
          { name: choicesField.name, value: choicesField.value },
          { name: 'Poll Results', value: `${pollResults.join('\n')} \n ${reactionCounts.reduce((total, value) => total + value, 0)} votes`, inline: false })
        .setImage(imageUrl); // Add fields including poll results

      // Edit the message content with the modified embed
      await message.edit({ embeds: [closedEmbed] });

      // Optionally, you can send a reply to inform the user that the poll was closed
      await interaction.editReply({ content:'Poll closed successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content:'Make sure the ID is correct.', ephemeral: true });
    }
  },

};
