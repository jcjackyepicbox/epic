const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

const pathToExamples = path.join(__dirname, '..', 'examples');
const pathToEpic = path.join(__dirname, '..', 'packages/epic-init/templates');

const templatePackageJson = {
  name: '<%= projectName %>',
  husky: {
    hooks: {
      'pre-commit': 'lint-staged',
    },
  },
  'lint-staged': {
    '*.{js,json,md,ts,tsx,jsx}': ['prettier --write', 'git add'],
  },
  devDependencies: {
    husky: '^4.3.0',
    'lint-staged': '^10.4.0',
  },
};

function getEpicTemplatePkgJson(path) {
  const rawData = fs.readFileSync(path + '/package.json');
  const config = JSON.parse(rawData);

  if (config['epicTemplate']) {
    return config['epicTemplate'];
  }

  return false;
}

async function readExampleDir() {
  const exampleTemplate = [];
  const exampleDir = await fs.readdirSync(pathToExamples);

  console.log(
    chalk.yellow('[Sync]'),
    `Collecting ${exampleDir.length} templates inside examples folder`
  );

  for (let i = 0; i < exampleDir.length; i++) {
    const itemName = exampleDir[i];

    const pathToItem = path.join(pathToExamples, itemName);
    const epicTemplate = getEpicTemplatePkgJson(pathToItem);

    if (!epicTemplate) continue;

    exampleTemplate.push({
      name: itemName,
      path: pathToItem,
    });
  }

  return exampleTemplate;
}

async function readEpicInitTemplateDir() {
  const epicTemplate = [];
  const epicDir = await fs.readdirSync(pathToEpic);
  console.log(
    chalk.yellow('[Sync]'),
    `Collecting ${epicDir.length} templates inside epic-init folder`
  );

  for (let i = 0; i < epicDir.length; i++) {
    const itemName = epicDir[i];

    const pathToItem = path.join(pathToEpic, itemName);

    epicTemplate.push({
      name: itemName,
      path: pathToItem,
    });
  }

  return epicTemplate;
}

async function promptTemplateChecklist(templateChoices) {
  const questions = [
    {
      name: 'template_list',
      type: 'checkbox',
      message: 'Choose following templates to be synced: ',
      choices: templateChoices,
      default: 'default',
    },
  ];

  return inquirer.prompt(questions);
}

function processTemplateList(exampleTemplate, epicTemplate) {
  const epicTemplateNames = epicTemplate.map((val) => val.name);
  return exampleTemplate.map((val) => {
    let templateStatus = '[NEW]';

    if (epicTemplateNames.includes(val.name)) {
      templateStatus = '[EXISTING]';
    }

    return {
      name: `${templateStatus} ${val.name}`,
      value: val.name,
    };
  });
}

async function syncProcess(arrTemplate) {
  if (arrTemplate.length === 0) {
    console.log(chalk.cyan('No Templates selected'));
  }

  try {
    arrTemplate.forEach((val) => {
      const pathFrom = path.join(pathToExamples, val);
      const pathDest = path.join(pathToEpic, val);

      console.log('Processing - ', val);

      if (fs.existsSync(pathDest)) {
        fs.rmSync(pathDest, { recursive: true });
      }

      console.log('Processing copy folder -', val);

      fse.copySync(pathFrom, pathDest, {
        overwrite: true,
        errorOnExist: true,
      });

      console.log(chalk.green(`${val} Successfully Synced!`));

      const pathPackageJson = pathDest + '/package.json';
      console.log('Processing package.json - ', val);

      const rawPackageJson = fs.readFileSync(pathPackageJson);
      const dataPackageJson = JSON.parse(rawPackageJson);

      dataPackageJson['name'] = templatePackageJson['name'];
      dataPackageJson['husky'] = templatePackageJson['huksy'];
      dataPackageJson['lint-staged'] = templatePackageJson['lint-staged'];
      dataPackageJson['devDependencies']['husky'] =
        templatePackageJson['devDependencies']['husky'];
      dataPackageJson['devDependencies']['lint-staged'] =
        templatePackageJson['devDependencies']['lint-staged'];

      fs.writeFileSync(pathPackageJson, JSON.stringify(dataPackageJson));
      console.log('Finish processing package.json - ', val);
    });
  } catch (err) {
    console.error('[Sync] ERR - ', err);
  }
}

async function init() {
  console.log();
  console.log(
    chalk.bold.red(
      'Before start syncing, please clean the examples first from node_modules or build files. If you have done so, please proceed'
    )
  );

  const startSync = await inquirer.prompt([
    {
      name: 'confirm_sync',
      type: 'confirm',
      message: 'Continue to syncing?',
    },
  ]);

  if (!startSync.confirm_sync) return;

  console.log(
    chalk.yellow('[Sync]'),
    'Start syncing from examples to epic-init'
  );

  const exampleTemplate = await readExampleDir();
  const epicTemplate = await readEpicInitTemplateDir();

  const templateChoices = processTemplateList(exampleTemplate, epicTemplate);
  const promptAnswer = await promptTemplateChecklist(templateChoices);

  console.log();
  console.log();

  syncProcess(promptAnswer.template_list);
}

init();
