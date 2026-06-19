require('ts-node').register();
const { getCopyBankData, getCalendarData } = require('./src/utils/marketing-data.ts');
console.log("Calendar posts parsed:", getCalendarData().length);
console.log("Copy bank assets parsed:", getCopyBankData().length);
