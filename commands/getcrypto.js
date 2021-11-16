const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
// const puppeteer = require('puppeteer-extra')
//const puppeteer = require('puppeteer')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

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
		.setName('getcrypto')
		.setDescription('Returns Crypto Robinhood Price')
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
        
        
                    const coinName =  await page.$eval('.css-10dsbjj', el => el.innerText);
                    const coinPrice =  await page.$eval('._1Nw7xfQTjIvcCkNYkwQMzL', el => el.innerText);
                    const coinPercentage =  await page.$eval('._27rSsse3BjeLj7Y1bhIE_9', el => el.innerText);
        
                    console.log(coinName);
                    console.log(coinPrice);
                    console.log(coinPercentage);
        
                    //await page.screenshot({ path: 'screenshots/adblocker.png', fullPage: true })
        
        
                //   await page.goto('https://www.google.com')
                //   await page.waitForTimeout(5000)
                //   await page.screenshot({ path: 'screenshots/stealth.png', fullPage: true })
        
                    console.log(`All done, check the Discord Message ✨`)
                    await browser.close()
        
                    const dataResultList = [];
                    dataResultList.push(coinName);
                    dataResultList.push(coinPrice);
                    dataResultList.push(coinPercentage);

                    const cryptoPriceFormatted = `${coinName} 🏹 ${coinPrice} - ${coinPercentage}`;

                    await interaction.editReply(cryptoPriceFormatted, { ephemeral: false });
        
                    return cryptoPriceFormatted;
                } catch(error) {
                    await interaction.editReply(error);
                    console.error(error);
                } finally {
                    await browser.close()
                }
            })


        })();

        

        // const file = new MessageAttachment('./assets/chart_tradingview.png');
        
        
        // const exampleEmbed = new MessageEmbed()
        //     .setTitle('Some title')
        //     .setImage('attachment://discordjs.png');
        

		// await interaction.reply('finviz_heatmap.png');
		//await interaction.reply({ files: [file] });
		
	},
};