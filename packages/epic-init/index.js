#!/usr/bin/env node
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const { getCurrentDirectoryBase } = require('./lib/dir');
const templateJson = require('./template.json');
const { promptQuestion } = require('./lib/prompt');

async function init() {
  console.log(
    chalk.yellow(figlet.textSync('EPIC', { horizontalLayout: 'full' }))
  );

  console.log(chalk.yellow('Welcome! Start your journey!'));

  console.log(
    chalk.yellow('You are currenly in directory: '),
    chalk.green(getCurrentDirectoryBase())
  );

  // const promptObj = await promptQuestion(templateJson.promptQuestion);
}

init();
