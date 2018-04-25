# UWI Grade Checker
Node tool using [Puppeteer](https://github.com/GoogleChrome/puppeteer) to check grades for UWI students and display a notification.

## Requirements
- Node 7.6.0 or greater
- (Optional) Yarn
- Operating System Requirements of [node-notifier](https://github.com/mikaelbr/node-notifier):
  - macOS: >= 10.8 or Growl if earlier.
  - Linux: notify-osd or libnotify-bin installed (Ubuntu should have this by default)
  - Windows: >= 8, task bar balloon for Windows < 8. Growl as fallback. Growl takes precedence over Windows balloons.
  - General Fallback: Growl


## Setup
Include a config.json file in the project directory that contains the following:
- id : your UWI Student ID number
- password: the password for your UWI account \
<b>Note</b>: Ensure the id and password properties are strings.

Install dependencies: ```yarn``` OR ```npm install```

## Running Appliction
```
> node main.js 
```
The files outputted by this script are .png images which show the grade for each of the courses that you have this semester.

<b>Note</b>: This script relies on the structure of the UWI website so if the structure changes this script will fail.


<b>Suggestion</b>: Use Cron on Linux to get a notification of the grades when you start your computer