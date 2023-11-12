import { Sequelize } from 'sequelize-typescript';

const POSTGRESURL = "postgres://fsywinwg:85R76Ck1BdFZjXuhaXvpOutgwvdjFeMq@satao.db.elephantsql.com/fsywinwg";
const sequelize = new Sequelize(POSTGRESURL, {
  dialect: 'postgres',
});

export { sequelize };