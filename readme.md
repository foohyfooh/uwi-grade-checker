# UWI Grade Checker
Node tool using Puppeteer to check grades for UWI students

## Requirements
- Node 8.9.1
- (Optional) Yarn

## Setup
Include a config.json file in the project directory that contains the following:
- id : your UWI Student ID number
- password: the password for your UWI account

```
> yarn
```

OR 

```
> npm install
```

## Running Appliction
```
> node main.js 
```

<b>Note</b>: This script relies on the structure of the UWI website so if the structure changes this script will fail.
