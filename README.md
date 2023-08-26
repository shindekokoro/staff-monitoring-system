# staff-monitoring-system
[![License](https://img.shields.io/github/license/shindekokoro/staff-monitoring-system)](http://choosealicense.com/licenses/mit/)

## Description
Staff Monitoring System (S.M.S.) Is an application to help companies manage employee databases.

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Tests](#tests)
- [Questions](#questions)

## Installation
Type in terminal:
1. `git clone https://github.com/shindekokoro/staff-monitoring-system.git`
2. `npm install`

## Usage
1. Make any changes to config.json as needed
2. Install pm2 server to ensure daemonization of app to keep alive. Use the command below if you don't have pm2 installed.
   - `npm install pm2 -g`
3. `pm2 start server.js --name sms`
4. `pm2 stop sms` to stop

## License
[MIT](http://choosealicense.com/licenses/mit/)

A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

## Tests
macOS, RaspbianOS

## Questions
**If you have any questions feel free to use the links below:**

GitHub Profile: https://github.com/shindekokoro

Email: brian.whisler@gmail.com
