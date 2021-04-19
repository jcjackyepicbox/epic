#!/usr/bin/env node
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const {
  getCurrentDirectoryBase,
  readAndCopyFileFromDirectory,
} = require('./lib/dir');
const { renderTemplateAndWrite } = require('./lib/template');
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

  const { project_name, template_type } = await promptQuestion(
    templateJson.promptQuestion
  );

  const chosenTemplate = templateJson.promptQuestion.filter(
    (val) => val.value === template_type
  )[0];

  readAndCopyFileFromDirectory(
    path.resolve(__dirname, 'templates', chosenTemplate.folderName),
    () => {
      renderTemplateAndWrite(project_name);
      console.clear();

      console.log(chalk.bold.green('Your project is ready!'));
      console.log();
      console.log(chalk.white('Project name: '), chalk.bold.cyan(project_name));
      console.log(
        chalk.white('Project template: '),
        chalk.bold.cyan(chosenTemplate.name)
      );

      console.log();
      console.log(chalk.yellowBright('Start Your Journey!'));
      console.log(chalk.cyanBright('> yarn'));
      console.log(chalk.cyanBright('> yarn start'));
      console.log();
    }
  );
}

init();
