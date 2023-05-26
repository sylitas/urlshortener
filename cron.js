const { mongoDBClient } = require('./db');
const CronJob = require('cron').CronJob;

new CronJob(
  process.env.CRON_TIMER,
  async () => {
    console.log('😎 Sylitas | Delete expired shorten url ');
    const expiredURL = await mongoDBClient('find', { expired: { $lt: new Date() } });
    if (!expiredURL.length) return;
    console.log('😎 Sylitas | expiredURL : ', expiredURL);
    const deletableIds = expiredURL.map(({ id }) => ({ id }));
    const { deletedCount } = await mongoDBClient('deleteMany', { id: { $nin: deletableIds } });
    console.log('😎 Sylitas | deletedCount : ', deletedCount);
  },
  null,
  true,
  'Asia/Ho_Chi_Minh'
).start();