const puppeteer = require('puppeteer');
const config = require('./config.json');

if(config.id === undefined || config.password === undefined){
  console.error('Ensure a config.json file exists with id and password properties.');
  process.exit();
}

if(typeof(config.id) !== 'string' || typeof(config.password) !== 'string'){
  console.error('Ensure config.json id and password properties are strings.');
  process.exit();
}

puppeteer.launch()
.then(async browser => {
  const page = await browser.newPage();
    await page.goto('https://my.uwi.edu/');
    await page.tap('#userMenu a[title=\'Sign In\']');
    
    await page.waitForSelector('.btn-submit');
    await page.type('input#username', config.id)
    await page.type('input#password', config.password);
    await page.tap('.btn-submit');

    let linkElement = await page.waitForSelector('#nav li:nth-child(4) a');
    let link = await (await linkElement.getProperty('href')).jsonValue();
    await page.goto(link);    

    linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(1) .mpdefault a');
    link = await (await linkElement.getProperty('href')).jsonValue();
    await page.goto(link);
    
    linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(2) .mpdefault a');
    link = await (await linkElement.getProperty('href')).jsonValue();
    await page.goto(link);

    // linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(4) .mpdefault a');
    // link = await (await linkElement.getProperty('href')).jsonValue();
    // await page.goto(link);

    linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(5) .mpdefault a');
    link = await (await linkElement.getProperty('href')).jsonValue();
    await page.goto(link);

    await (await page.waitForSelector('.dataentrytable input[type=submit]')).tap();
    await page.screenshot({path: 'grade list.png'});

    await page.waitForSelector('.datadisplaytable');
    let linkElements = await page.$$('.datadisplaytable a');
    let gradLinkPromises = linkElements.map(async linkElement => 
      await (await linkElement.getProperty('href')).jsonValue());
    let links = await Promise.all(gradLinkPromises);
    for(let i = 0; i < linkElements.length; i++){
      await page.goto(links[i]);
      await page.waitForSelector('.datadisplaytable:nth-of-type(2)');
      await (await page.$('.datadisplaytable:nth-of-type(1)')).tap();
      await (await page.$('.datadisplaytable:nth-of-type(2)')).tap();
      await page.screenshot({path: `grade_${i + 1}.png`});
    }

    await browser.close();
})
.catch(e => {
  console.log(e);
  process.exit();
});
