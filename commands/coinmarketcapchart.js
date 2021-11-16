const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinmarketcapchart')
		.setDescription('Returns CoinMarketCap Price Chart')
        .addStringOption(option => option.setName('coin').setDescription('Enter a Coin Name').setRequired(true)),
	async execute(interaction) {


        const ticker = interaction.options.getString('coin').toUpperCase();

        
        (async () => {

            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });
                    
                
                    //const response = await page.goto(`https://coinmarketcap.com/currencies/${ticker}`);
                    //const headers = response.headers();
                    //console.log(headers);
        
                    console.log(`Loading webpage`);
                    await interaction.followUp(`Working on pull up ${ticker.toLowerCase()} it`);
                    await page.goto(`https://coinmarketcap.com/currencies/${ticker}`, { waitUntil: 'networkidle0' });

                    
                    // Shows 7 days chart
                    await page.waitForSelector('#react-tabs-2');
                    await page.click('#react-tabs-2');

                    await page.waitForTimeout(5000);
                    
                    // CoinMarketCap Chart Area
                    const chart = await page.$('.sc-16r8icm-0 > .sc-16r8icm-0 > .sc-19zk94m-2 > .sc-1k1vs7f-0 > div');
                    let coinChart = await chart.screenshot();
                            
                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply({ files: [coinChart] });
        
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