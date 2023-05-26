const cors = require('cors');
const express = require('express');
const Shortid = require('shortid')
const { generateExpiredDate } = require('./utils');
const { mongoDBClient } = require('./db');
require('dotenv').config();
if (process.env.CRON_ENABLED.toLowerCase() === 'true') require('./cron');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  // TODO: Send homepage here
  res.send('hello world')
})

app.get('/:id', async (req, res) => {
  console.log('😎 Sylitas | Get a old url by using shortener URL ');
  const { id: urlId } = req.params;
  const data = await mongoDBClient('findOne', { id: urlId });
  res.redirect(data.userURL);
})

app.post('/', async (req, res) => {
  console.log('😎 Sylitas | Create a shortener URL ');
  const { url, expiredAfter = 30 } = req.body;

  const urlId = Shortid.generate();

  await mongoDBClient('insertOne', {
    id: urlId,
    userURL: url,
    expired: generateExpiredDate(expiredAfter)
  });

  const domain = process.env.DOMAIN || `${process.env.HOST}:${process.env.PORT}`

  res.status(200).json({ url: `http://${domain}/${urlId}` })
})

app.listen(parseInt(process.env.PORT), () => {
  console.log('😎 Sylitas | Application listing on port', process.env.PORT);
})