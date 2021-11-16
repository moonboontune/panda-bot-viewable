const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pandahelp')
		.setDescription('Returns List of All Panda Bot Commands'),
	async execute(interaction) {
		await interaction.reply(
        '\`\`\`' + 
        'robinhoodchart: Returns Crypto Robinhood Price Chart\n' +
        'descriptionrobin: Returns Robinhood Stock Description\n' +
        'stockrobin: Returns Current Robinhood Stock Price Info\n' +
        'getchart: Returns TradingView Stock Chart (Ex. /getchart ticker:spy interval:d theme:light percent:on)\n' +
        'getcrypto: Returns Robinhood Crypto Price Info\n' +
        'coinmarketcapchart: Returns CoinMarketCap Price Chart\n' +
        'heatmap: Returns Stock Market Heat map\n' +
        'cryptomap: Returns Crypto Heat map\n' +
        'cryptoheat: Returns Alternative Crypto Heat map\n' +
        'grabimage: Returns Google Image from given keyword\n' +
        'oof: Returns oof gif\n' +
        'sweaten: Returns sweaten gif\n' +
        'pandahelp: Returns list of Panda bot commands\n' +
        'ping: Returns Pong to Check Bot Online Status\n' +
        '\`\`\`'
        );
	},
};