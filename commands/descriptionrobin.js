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
		.setName('descriptionrobin')
		.setDescription('Returns Robinhood Stock Description.')
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


                    // Puppeeteer button clicks on view more and then grabs stock description
                    // Uses XPATH, if XPATH has double quotes, use single quotes for outside of string
                    const [button] = await page.$x('//*[@id="react_root"]/main/div[2]/div/div/div/div/div/main/div/div[1]/section[3]/div[1]/h3/span/button');

                    if (button) {
                        await button.click();
                    }

                    const stockName =  await page.$eval('.css-g3q8cr', el => el.innerText);
                    const stockPrice =  await page.$eval('._1Nw7xfQTjIvcCkNYkwQMzL', el => el.innerText);
                    const stockPercentage =  await page.$eval('._27rSsse3BjeLj7Y1bhIE_9', el => el.innerText);
                    const stockDescription =  await page.$eval('.css-15poin4', el => el.innerText);


                    // await page.waitForSelector('#react_root > main > div:nth-child(3) > div > div > div > div > div > div > div > div.col-12 > section._3ZzTswmGTiUT4AhIhKZfZh.css-1dgp5xu');
                    // const chartSection = await page.$('#react_root > main > div:nth-child(3) > div > div > div > div > div > div > div > div.col-12 > section._3ZzTswmGTiUT4AhIhKZfZh.css-1dgp5xu');
                    // let chartScreenshot = await chartSection.screenshot();

                    //let screenshot = await page.screenshot({ fullPage: true });
        
                    console.log(`All Data Taken, check the Discord Message ✨`);
                    await browser.close();
                    
                    const stockPriceFormatted = `${stockName} 🏹 ${stockPrice} - ${stockPercentage}\n\n${stockDescription}`;
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