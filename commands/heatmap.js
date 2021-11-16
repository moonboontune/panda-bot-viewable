const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('heatmap')
		.setDescription('Returns heatmap of stock market from FinViz'),
	async execute(interaction) {

        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
                
                    await interaction.followUp('Loading Finviz Heatmap');

                    console.log(`Going to Finviz Site..`)
                    await page.goto(`https://finviz.com/map.ashx?t=sec`, { waitUntil: 'networkidle0' });

                    await page.waitForSelector('#share-map');
                    await page.click('#share-map');
                                        
                    await page.waitForSelector('#static');
                            
                    // Div element
                    let linkELement = await page.$('#static');
        
                    // Extract link value from div element
                    let linkValue = await linkELement.evaluate(el => el.value, linkELement);
        
                    console.log('Here link value: ' + linkValue);

                            
                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply(`${linkValue}`);
        
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