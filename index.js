// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
var log = require('./logger')
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs');




// puppeteer usage as normal
puppeteer.launch({ 
    headless: false,        
    executablePath: '/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe', 
    defaultViewport:null,
    devtools: false,
 }).then(async browser => {
    console.log('Running tests..')
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
    setInterval(refresh, 120000);
    




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
    if(await page.url()==='https://www.twitch.tv/rocketleague'){
        const cookies = await page.cookies();
        saveCookie(cookies)

    }
}