const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(interaction) {
    console.log("CATCHED AN INTERACTION");
  },
};