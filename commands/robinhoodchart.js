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

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
//const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
//puppeteer.use(AdblockerPlugin({ blockTrackers: true }));



module.exports = {
	data: new SlashCommandBuilder()
		.setName('robinhoodchart')
		.setDescription('Returns Crypto Robinhood Price Chart')
        .addStringOption(option => option.setName('ticker').setDescription('Enter a ticker symbol').setRequired(true)),
	async execute(interaction) {


        const ticker = interaction.options.getString('ticker').toUpperCase();

        
        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
        
                    cryptoTicker = ticker;
        
                    const response = await page.goto(`https://www.robinhood.com/crypto/${cryptoTicker}`);
                    const headers = response.headers();
                    //console.log(headers);
        
                    console.log(`Loading webpage`);
                    await interaction.followUp('Working on it');
                    await page.goto(`https://www.robinhood.com/crypto/${cryptoTicker}`, { waitUntil: 'networkidle0' });

                    await page.waitForSelector('#react_root > main > div:nth-child(3) > div > div > div > div > div > div > div > div.col-12 > section._3ZzTswmGTiUT4AhIhKZfZh.css-1dgp5xu');
                    const chartSection = await page.$('#react_root > main > div:nth-child(3) > div > div > div > div > div > div > div > div.col-12 > section._3ZzTswmGTiUT4AhIhKZfZh.css-1dgp5xu');
                    let chartScreenshot = await chartSection.screenshot();

                    //let screenshot = await page.screenshot({ fullPage: true });
        
                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply({ files: [chartScreenshot] });
        
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