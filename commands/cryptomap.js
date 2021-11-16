const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer')
const { MessageAttachment, MessageEmbed } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('cryptomap')
		.setDescription('Returns heatmap of crypto market from Coin360'),
	async execute(interaction) {


        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
                
                    await interaction.followUp('Loading Coin360 Crypto Heatmap');

                    console.log(`Going to Coin360 Site..`)
                    await page.goto(`https://coin360.com/?dependsOn=volume&exceptions=[USDT%2CBUSD]`, { waitUntil: 'networkidle0' });

                    await page.waitForSelector('.MapBox');
                    
                    await page.waitForSelector('#app > .App > .StickyCorner > .StickyCorner__Container > .StickyCorner__Close');
                    await page.click('#app > .App > .StickyCorner > .StickyCorner__Container > .StickyCorner__Close');

            
                    //const coinChartSelection = await page.$('.MapBox');
                    const coinChartSelection = await page.$('#app > section > section');
                    let chartScreenshot = await coinChartSelection.screenshot();
        
                    //await coinChartSelection.screenshot({ path: 'screenshots/coin360Chart.png'})        
                            
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