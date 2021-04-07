// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
var log = require('./logger')
var moment = require('moment');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs');




// puppeteer usage as normal
puppeteer.launch({ 
    headless: true,        
    executablePath: '/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe', 
    defaultViewport:null,
    devtools: false,
 }).then(async browser => {

    global.page = await browser.newPage()


    if(fs.readFileSync('./cookies.json').length === 0){
        log('No Cookies Sending to Login', 'init')
        
        await page.goto('https://www.twitch.tv/login', {waitUntil: 'networkidle2'})
        await page.type('#login-username', 'wazlu ', {delay: 100}); // Types slower, like a user
        await page.type('#password-input', 'craftmine', {delay: 100}); // Types slower, like a user
        await page.click('#root > div > div.scrollable-area > div.simplebar-scroll-content > div > div > div > div.tw-mg-b-1 > form > div > div:nth-child(3) > button')

    
    

    } else {
        log('Fetched Cookies Sending to Load Cookies', 'init')
        useCookie()

    }
    await page.goto('https://www.twitch.tv/drops/inventory', {waitUntil: 'networkidle2'})
    global.screenshot = await page.screenshot({path: 'Dropstart.png', fullPage: true});
    await page.goto('https://www.twitch.tv/rocketleague', {waitUntil: 'networkidle2'})
    
    await page.click('#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.persistent-player.tw-elevation-0 > div > div.video-player > div > div > div > div.content-overlay-gate.player-overlay-background.player-overlay-background--darkness-0.tw-absolute.tw-align-items-center.tw-bottom-0.tw-c-text-overlay.tw-flex.tw-flex-column.tw-justify-content-center.tw-left-0.tw-right-0.tw-top-0 > div > div.content-overlay-gate__allow-pointers.tw-mg-t-3 > button').catch(err => {
        log('No Viewer Discrection Button to Click','err')
        page.screenshot({path: 'NoButtonComf.png', fullPage: true});
        setInterval(refresh, 35000);
    })
    setInterval(refresh, 35000);
    




  })



async function saveCookie(cookies){
    
    await fs.writeFileSync('./cookies.json', '', function(){console.log('Cookies Cleared')})

    //console.log(cookies)
    await fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))
    log(`New Cookie Value Saved to /cookies.json`, 'ok')
}


async function useCookie(){
    const cookiesString = await fs.readFileSync('./cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    log('Cookies Loaded to Browser', 'ok')
}


async function refresh(){


    await page.goto('https://www.twitch.tv/rocketleague', {waitUntil: 'networkidle2'})
    await page.screenshot({path: 'refresh.png', fullPage: true});

    if(await page.url()==='https://www.twitch.tv/rocketleague'){
        const cookies = await page.cookies();
        saveCookie(cookies)

    }
}