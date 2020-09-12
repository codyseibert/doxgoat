const moment = require('moment');

const between = '2018-06-30T21:47:00.000Z'

const isBetween = moment().isBetween(
  moment('2018-06-31T21:47:00.000Z'),
  moment('2018-06-31T21:47:00.000Z'),
  'day',
  '[]'
)
console.log(isBetween)