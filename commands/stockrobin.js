const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`

const { MessageAttachment, MessageEmbed } = require('discord.js');

//var HTMLParser = require('node-html-parser');

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stockrobin')
		.setDescription('Returns Robinhood Stock Price Info.')
        .addStringOption(option => option.setName('ticker').setDescription('Enter a ticker symbol').setRequired(true)),
	async execute(interaction) {


        const ticker = interaction.options.getString('ticker').toUpperCase();

        
        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
        
                    stockTicker = ticker;
        
                    const response = await page.goto(`https://www.robinhood.com/stocks/${stockTicker}`);
                    const headers = response.headers();
                    //console.log(headers);
        
                    console.log(`Loading webpage`);
                    await interaction.followUp('Loading Robinhood Site');
                    console.log(`Going to Robinhood Site..`)
                    await page.goto(`https://www.robinhood.com/stocks/${stockTicker}`, { waitUntil: 'networkidle0' });

                    const stockName =  await page.$eval('.css-g3q8cr', el => el.innerText);
                    const stockPrice =  await page.$eval('._1Nw7xfQTjIvcCkNYkwQMzL', el => el.innerText);
                    const stockPercentage =  await page.$eval('._27rSsse3BjeLj7Y1bhIE_9', el => el.innerText);

                    console.log(`All Data Taken, check the Discord Message ✨`);
                    await browser.close();
                    
                    const stockPriceFormatted = `${stockName} 🏹 ${stockPrice} - ${stockPercentage}`;
                    console.log(`${stockPriceFormatted}`);

                    await interaction.editReply(stockPriceFormatted, { ephemeral: false });
        
                    return;
                } catch(error) {
                    await interaction.editReply(error);
                    console.error(error);
                } finally {
                    await browser.close()
                }
            })


        })();
		
	},
};