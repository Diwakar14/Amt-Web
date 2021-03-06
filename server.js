// First, run 'npm install --save pusher express body-parser cookie-parser'
// Then run this file with 'node server.js'

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '974968',
    key: 'cc9f78e5cfc1cf39b804',
    secret: '9e1e033c4a3605a67476',
    cluster: 'ap2',
    useTLS: true
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // Primitive auth: the client self-identifies. In your production app, 
  // the client should provide a proof of identity, like a session cookie.
  const user_id = req.cookies.user_id; 

  const presenceData = { user_id: user_id };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}!`));