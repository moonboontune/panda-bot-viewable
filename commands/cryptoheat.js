const { SlashCommandBuilder } = require('@discordjs/builders');

const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
//const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
//puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 


const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cryptoheat')
		.setDescription('Returns heatmap of crypto market from Tradingview'),
	async execute(interaction) {

        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
                    
                    // Enables darkmode
                    await page.emulateMediaFeatures([{
                        name: 'prefers-color-scheme', value: 'dark' 
                    }]);

                    await interaction.followUp('Loading TradingView Crypto Heatmap');

                    console.log(`Going to TradingView Site..`)
                    await page.goto(`https://www.tradingview.com/heatmap/crypto/?color=change&dataset=Crypto&group=no_group&size=market_cap_calc`, { waitUntil: 'networkidle0' });


                    
                    await page.waitForSelector('body > div.tv-main > div.tv-content > div.js-market-heatmap.market-heatmap-wrapper.market-heatmap-wrapper--loaded > div > div:nth-child(2) > div.canvasContainer-Vlhzv2Ir');
                    const coinChartSelection = await page.$('body > div.tv-main > div.tv-content > div.js-market-heatmap.market-heatmap-wrapper.market-heatmap-wrapper--loaded > div > div:nth-child(2) > div.canvasContainer-Vlhzv2Ir');
                    let chartScreenshot = await coinChartSelection.screenshot();
        
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