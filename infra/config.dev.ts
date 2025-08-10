import { IAppStackConfig } from './bin/infra';

// define project name (any) - will be used as part of naming for some resources like docker image, database, etc.
const projectShortName = 'simplenestjs';

// define postfix for environment resources to specify
const suffix = '-dev';
const projectName = projectShortName + suffix;

// define your registered domain (you must have one at Route53)
const domainName = 'for-test.click';

// subdomain for api (will be created)
const subDomainNameApi = `api.${projectName}`;
const fullSubDomainNameApi = `${subDomainNameApi}.${domainName}`;

// user for deployment using CI/CD (will be created)
const userDeploerName = `${projectName}-deployer`;

// database name
const databaseName = projectShortName + suffix.replace('-', ''); // DatabaseName must begin with a letter and contain only alphanumeric characters
const databaseUsername = 'postgres';

const targetNodeEnv = 'development';

const siteOrigin =
  'http://localhost:3000,http://localhost:4200,http://localhost:3001';

console.info('using development config...');

export const config: IAppStackConfig = {
  databaseName,
  domainName,
  projectName,
  subDomainNameApi,
  fullSubDomainNameApi,
  userDeploerName,
  databaseUsername,
  targetNodeEnv,
  siteOrigin,
};
