const puppeteer = require('puppeteer');
const notifier = require('node-notifier');
const cheerio = require('cheerio');
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
  //Goto UWI Website
  const page = await browser.newPage();
  await page.goto('https://my.uwi.edu/');
  await page.tap('#userMenu a[title=\'Sign In\']');
  
  //Login
  await page.waitForSelector('.btn-submit');
  await page.type('input#username', config.id)
  await page.type('input#password', config.password);
  await page.tap('.btn-submit');

  //Goto MySecureArea
  let linkElement = await page.waitForSelector('#nav li:nth-child(4) a');
  let link = await (await linkElement.getProperty('href')).jsonValue();
  await page.goto(link);    

  //Goto Studnet Services & Financial Aid
  linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(1) .mpdefault a');
  link = await (await linkElement.getProperty('href')).jsonValue();
  await page.goto(link);
  
  //Goto Student Records
  linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(2) .mpdefault a');
  link = await (await linkElement.getProperty('href')).jsonValue();
  await page.goto(link);

  // //Goto Final Grades
  // linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(4) .mpdefault a');
  // link = await (await linkElement.getProperty('href')).jsonValue();
  // await page.goto(link);

  //Goto Grade Details
  linkElement = await page.waitForSelector('.menuplaintable tr:nth-of-type(5) .mpdefault a');
  link = await (await linkElement.getProperty('href')).jsonValue();
  await page.goto(link);

  //Click Submit
  await (await page.waitForSelector('.dataentrytable input[type=submit]')).tap();

  //Get the links for the courses 
  await page.waitForSelector('.datadisplaytable');
  let linkElements = await page.$$('.datadisplaytable a');
  let gradLinkPromises = linkElements.map(async linkElement => 
    await (await linkElement.getProperty('href')).jsonValue());
  let links = await Promise.all(gradLinkPromises);
  
  //Get the grades for each course
  for(let i = 0; i < linkElements.length; i++){
    await page.goto(links[i]);
    let $ = cheerio.load(await page.content());

    let attributes = $('.datadisplaytable:nth-of-type(1)');
    let courseCodeSubject = attributes.find('tr:nth-of-type(2) td.ntdefault').text();
    let courseCodeNumber = attributes.find('tr:nth-of-type(3) td.ntdefault').text();
    let courseTitle = attributes.find('tr:nth-of-type(5) td.ntdefault').text();
    let course = `${courseCodeSubject} ${courseCodeNumber} ${courseTitle}`;

    let grade = $('.datadisplaytable:nth-of-type(2)');
    let rows = grade.find('tr:not(:first-child)');
    let gradeInfo = rows.map((index, element) => {
      let row = $(element);
      let rowTitle = row.find('td:nth-of-type(1)').text();
      let rowScore = row.find('td:nth-of-type(2)').text();
      return `${rowTitle}: ${rowScore}`;
    }).get()
    .map(component => component + '\n')
    .reduce((gradeInfo, component) => gradeInfo + component);

    console.log(gradeInfo);
    
    notifier.notify({
      title: 'UWI Grade Checker - ' + course,
      message: gradeInfo
    });
  }
  await browser.close();
})
.catch(e => {
  console.log(e);
  process.exit();
});
