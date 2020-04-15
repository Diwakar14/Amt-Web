// First, run 'npm install --save pusher'

// const Pusher = require('pusher');
import * as Pusher from 'pusher';
import { RequestOptions } from 'https';
const pusher = new Pusher({
  appId: '974968',
  key: 'cc9f78e5cfc1cf39b804',
  secret: '9e1e033c4a3605a67476',
  cluster: 'ap2',
  useTLS: true
});
// Trigger a new random event every second. In your application,
// you should trigger the event based on real-world changes!


setInterval(() => {
  pusher.trigger('siddhant1', 'message-exchange', { 
    "message": "Hello Diwakar"
  });
  console.log(pusher);
}, 1000);

// let opt:RequestOptions = {
//   m
// }
pusher.get({'54.186.217.203:5009/message'},()=>{

})