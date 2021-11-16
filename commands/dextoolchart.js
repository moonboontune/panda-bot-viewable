const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
//puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('dextoolchart')
		.setDescription('Returns crypto chart from Dextool')
        .addStringOption(option => option.setName('contractaddress').setDescription('Enter a contract address').setRequired(true))
        .addStringOption(option => option.setName('interval').setDescription('Enter a time interval: 1, 5, 10, 15, 1h, 2h, 4h, D, M'))
        .addStringOption(option => option.setName('percent').setDescription('Optional, Set Percentage Based Chart (on or off)'))
        .addStringOption(option => option.setName('theme').setDescription('Optional, Set chart theme: light or dark')),
	async execute(interaction) {


        const contractAddress = interaction.options.getString('contractaddress');
        let time_interval = interaction.options.getString('interval');
        const theme = interaction.options.getString('theme');
        //const percent = interaction.options.getString('percent');

        let darkMode = true;
        //let percentMode = false;

        if(theme){
            darkMode = false;
        }

        // console.log(percent);

        // if(percent){
        //     percentMode = true;
        // }

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
        
        // if(time_interval !== '1' && time_interval !== '5' && time_interval !== '10' && time_interval !== '15' && time_interval !== '60' && time_interval !== '120' && time_interval !== '240' && time_interval !== 'D' && time_interval !== 'M') {
        //     return interaction.reply('Please give time interval: (1, 5, 10, 15, 1h, 2h, 4h, D, M) ');
        // }


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

                    console.log(`Loading Dextools Chart`);
                    await interaction.followUp('Loading up Dextools Chart');
		            //await page.setDefaultNavigationTimeout(0);
                    //await page.goto(url, { waitUntil: 'networkidle0' });
                    await page.goto(url, { waitUntil: 'domcontentloaded' });
                    //await page.goto(url);

                    // Waiting for page to load in
                    await page.waitForTimeout(15000);

                    //await page.waitForSelector('.ng-tns-c115-5 > .main-content > .main-content-container > .row > .col-12:nth-child(3)');
                    //const chartArea = await page.$('.ng-tns-c115-5 > .main-content > .main-content-container > .row > .col-12:nth-child(3)');
                    //await chartArea.screenshot();
                    //let dextoolsChart = await chartArea.screenshot();
                    let dextoolsChart = await page.screenshot();
                    // console.log(percentMode);

                    // // Sets Percentage Mode
                    // if(percentMode){
                    //     await page.waitForSelector('.chart-toolbar > .toolbar-2yU8ifXU > .seriesControlWrapper-2yU8ifXU > .inline-2yU8ifXU > .icon-2yU8ifXU');
                    //     await page.click('.chart-toolbar > .toolbar-2yU8ifXU > .seriesControlWrapper-2yU8ifXU > .inline-2yU8ifXU > .icon-2yU8ifXU');
                    // }
                    
                            
                    console.log(`All Screenshot Taken, check the Discord Message ✨`)
                    await browser.close()

                    await interaction.editReply({ files: [dextoolsChart] });
        
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
