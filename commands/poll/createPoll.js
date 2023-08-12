const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//If more than 15 choices is set, more reactions must be added to the reactions array
const MAX_CHOICES = 15;

const command = new SlashCommandBuilder()
  .setName('createpoll')
  .setDescription('Create a poll')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('What is the question for this poll?'))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('Add an image link to the poll'));

for (let i = 1; i <= MAX_CHOICES; i++) {
  command.addStringOption(option =>
    option.setName(`choice${i}`)
      .setDescription(`Choice ${i}`));
}

module.exports = {
  data: command,
  async execute(interaction) {

    const choices = [];

    for (let i = 1; i <= MAX_CHOICES; i++) {
      const choice = interaction.options.getString(`choice${i}`);
      if (choice) {
        choices.push(choice);
      }
    }

    const choicesValue = choices.map((choice, index) => `:regional_indicator_${String.fromCharCode(97 + index)}: ${choice}`).join('\n');

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setAuthor({ name: ' Sanqo', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .addFields(
        { name: 'Question', value: interaction.options.getString('question') },
        { name: 'Choices', value: choicesValue, inline: false },
      )
      .setImage(interaction.options.getString('image'))
      .setTimestamp()
      .setFooter({ text: 'Poll ID:' });

    await interaction.reply({ embeds: [exampleEmbed], fetchReply: true });

    const sentMessage = await interaction.fetchReply(); // Get the sent message

    exampleEmbed.setFooter({ text: `Poll ID: ${sentMessage.id}` });

    await interaction.editReply({ embeds: [exampleEmbed] });

    const reactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴'];
    for (let i = 0; i < choices.length; i++) {
      await sentMessage.react(reactions[i]); // React on the sent message
    }

    const filter = () => true;
    const collector = sentMessage.createReactionCollector({ filter });

    collector.on('collect', async (reaction, user) => {
      console.log("collected a reaction");

      // Fetch the message to get the current reactions
      const message = await reaction.message.fetch();

      // Iterate through the reactions of the message
      message.reactions.cache.each(async (r) => {
        if (r.emoji.name !== reaction.emoji.name) {
          // If the reaction is not the one that was just added, remove the user from it
          await r.users.remove(user.id);
        }
      });

      // You can also remove the user from the reaction that was just added if you want
      // await reaction.users.remove(user.id);
    });
  },
};