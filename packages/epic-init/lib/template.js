const fs = require('fs');
const ejs = require('ejs');

const files_template = ['./package.json', './README.md'];

function renderTemplateAndWrite(project_name) {
  files_template.forEach((val) => {
    let contents = fs.readFileSync(val, 'utf8');
    contents = ejs.render(contents, { projectName: project_name });
    fs.writeFileSync(val, contents, 'utf8');
  });
}

module.exports = {
  renderTemplateAndWrite,
};
