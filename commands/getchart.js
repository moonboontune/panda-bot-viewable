const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
// const puppeteer = require('puppeteer-extra')
const puppeteer = require('puppeteer')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('getchart')
		.setDescription('Returns stock chart from TradingView')
        .addStringOption(option => option.setName('ticker').setDescription('Enter a ticker symbol').setRequired(true))
        .addStringOption(option => option.setName('interval').setDescription('Enter a time interval: 1, 5, 10, 15, 1h, 2h, 4h, D, M').setRequired(true))
        .addStringOption(option => option.setName('percent').setDescription('Optional, Set Percentage Based Chart (on or off)'))
        .addStringOption(option => option.setName('theme').setDescription('Optional, Set chart theme: (light or white or l or w) or dark')),
	async execute(interaction) {


        const ticker = interaction.options.getString('ticker').toUpperCase();
        let time_interval = interaction.options.getString('interval');
        const theme = interaction.options.getString('theme');
        const percent = interaction.options.getString('percent');

        let darkMode = true;
        let percentMode = false;

        if(theme === 'light' || theme === 'white' || theme === 'w' || theme === 'l'){
            darkMode = false;
        }

        console.log('Dark Mode is set to ' + darkMode);
        console.log('Percent is set to ' + percent);

        if(percent){
            percentMode = true;
        }

        // Allows for lower case d input
        if(time_interval === 'd') {
            time_interval = 'D';
        } else if (time_interval === '1h') {
            time_interval = '60';
        } else if (time_interval === '2h') {
            time_interval = '120';
        } else if (time_interval === '4h') {
            time_interval = '240';
        } else if (time_interval === '1m') {
            time_interval = '1';
        } else if (time_interval === '5m') {
            time_interval = '5';
        } else if (time_interval === '10m') {
            time_interval = '10';
        } else if (time_interval === '15m') {
            time_interval = '15';
        } else if (time_interval === 'm') {
            time_interval = 'M';
        }
        
        if(time_interval !== '1' && time_interval !== '5' && time_interval !== '10' && time_interval !== '15' && time_interval !== '60' && time_interval !== '120' && time_interval !== '240' && time_interval !== 'D' && time_interval !== 'M') {
            return interaction.reply('Please give time interval: (1, 5, 10, 15, 1h, 2h, 4h, D, M) ');
        }




        const url = `https://www.tradingview.com/chart/?symbol=${ticker}&interval=${time_interval}`;

        
        (async () => {


            puppeteer.launch({ headless: true, defaultViewport: null }).then(async browser => {
                try {

                    await interaction.deferReply({ ephemeral: false });

                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080 });

                    // Sets dark mode on by default unless made false
                    if(darkMode){
                        // Create Dark Mode screenshot
                        await page.emulateMediaFeatures([{
                            name: 'prefers-color-scheme', value: 'dark' }]);
                    }
                    
                    console.log(`Loading TradingView`);
                    await interaction.followUp('Loading up TradingView');
                    await page.goto(url, { waitUntil: 'networkidle0' });
                    
                    // Sets Percentage Mode
                    if(percentMode){
                        await page.waitForSelector('.chart-toolbar > .toolbar-2yU8ifXU > .seriesControlWrapper-2yU8ifXU > .inline-2yU8ifXU > .icon-2yU8ifXU');
                        await page.click('.chart-toolbar > .toolbar-2yU8ifXU > .seriesControlWrapper-2yU8ifXU > .inline-2yU8ifXU > .icon-2yU8ifXU');
                    }
                    
                    // TradingView Chart Area
                    await page.waitForSelector('body > div.js-rootresizer__contents > div.layout__area--center');
                    const chartArea = await page.$('body > div.js-rootresizer__contents > div.layout__area--center');
                    let tradingviewChart = await chartArea.screenshot();

                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply({ files: [tradingviewChart] });
        
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