const fs = require('fs');

const envFile = {
  development: '.env.development',
  test: '.env.test',
  uat: '.env.uat',
  production: '.env.production',
};

/**
 *
 * @param {development | test | uat | productioin} env specify env defined in you webpack config paramater
 * @description get env file name
 */
function getCurrentEnvFile(param) {
  let envPath = envFile.development;
  Object.keys(envFile).every((env) => {
    if (param[env]) {
      envPath = envFile[env];
      return false;
    }

    return true;
  });

  return envPath;
}

/**
 *
 * @param {string} currentPathEnv specify absolute path to the env file
 * @description get public path in .env file of key PUBLIC_URL
 */
function getPublicPathEnv(currentPathEnv) {
  const lines = fs
    .readFileSync(currentPathEnv, 'utf-8')
    .split('\n')
    .filter(Boolean);

  let publicURL = '/';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].split('=');
    if (line[0] === 'PUBLIC_URL') {
      publicURL = line[1];
    }
  }

  return publicURL;
}

module.exports = {
  getCurrentEnvFile,
  getPublicPathEnv,
};
