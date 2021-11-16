const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
//const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
//puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('dextoolprice')
		.setDescription('Returns crypto price from Dextool')
        .addStringOption(option => option.setName('contractaddress').setDescription('Enter a contract address').setRequired(true))
        .addStringOption(option => option.setName('theme').setDescription('Optional, Set chart theme: light or dark')),
	async execute(interaction) {


        const contractAddress = interaction.options.getString('contractaddress');
        const theme = interaction.options.getString('theme');

        let darkMode = true;

        if(theme === 'light'){
            darkMode = false;
        }

        const url = `https://www.dextools.io/app/ether/pair-explorer/${contractAddress}`;

        
        (async () => {


            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {
		    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });


                    if(darkMode){
                        // Create Dark Mode screenshot
                        await page.emulateMediaFeatures([{
                            name: 'prefers-color-scheme', value: 'light' }]);
                    }

                    console.log(`Loading Dextools Price Info`);
                    await interaction.followUp('Loading up Dextools Price Info');
                    await page.goto(url, { waitUntil: 'networkidle0' });
                    
                    // Waiting for page to load in
                    await page.waitForTimeout(12000);
                    
                    // Dextools Price Info Area
                    //await page.waitForSelector('.ng-tns-c115-5 > .main-content > .main-content-container > .row:nth-child(2) > .col-12:nth-child(2)');
                    const priceInfo = await page.$('.ng-tns-c115-5 > .main-content > .main-content-container > .row:nth-child(2) > .col-12:nth-child(2)');
                    let dextoolsPriceInfo = await priceInfo.screenshot();
                    
                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply({ files: [dextoolsPriceInfo] });
        
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
