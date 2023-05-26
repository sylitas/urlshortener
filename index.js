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
app.use(express.static('public'));

const domain = process.env.DOMAIN || `${process.env.HOST}:${process.env.PORT}`

app.get('/', (req, res) => { res.sendFile('./public/index.html') })

app.get('/:id', async (req, res) => {
  console.log('😎 Sylitas | Get a old url by using shortener URL ');
  const { id: urlId } = req.params;
  console.log('😎 Sylitas | urlId : ', urlId);
  if (!urlId || urlId === '') {
    res.redirect('/')
  } else {
    const { userURL } = await mongoDBClient('findOne', { id: urlId });
    res.redirect(userURL);
  }
})

app.post('/', async (req, res) => {
  console.log('😎 Sylitas | Create a shortener URL ');
  const { url, expiredAfter = parseInt(process.env.AFTER_DAYS, 10) } = req.body;

  const urlId = Shortid.generate();

  await mongoDBClient('insertOne', {
    id: urlId,
    userURL: url,
    expired: generateExpiredDate(expiredAfter)
  });

  res.status(200).json({ url: `http://${domain}/${urlId}` })
})

app.listen(parseInt(process.env.PORT), () => {
  console.log('😎 Sylitas | Application listing on port', process.env.PORT);
})