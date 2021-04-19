const inquirer = require('inquirer');

function promptQuestion(templateJson) {
  const templateChoices = templateJson.map((val) => {
    return {
      name: val.name,
      value: val.value,
    };
  });

  const questions = [
    {
      name: 'project_name',
      type: 'input',
      message: 'Enter your project name:',
      validate: function (value) {
        if (value.length) {
          return true;
        }

        return 'Please enter your project name';
      },
    },
    {
      name: 'template_type',
      type: 'list',
      message: 'Choose following templates:',
      choices: templateChoices,
      default: 'default',
    },
  ];

  return inquirer.prompt(questions);
}

module.exports = {
  promptQuestion,
};
