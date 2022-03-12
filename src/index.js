const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const { getAllOccasions, getAllMessages, getMessage, createMessage, updateMessage, getMessagesFor } = require('./service');
const app = express();
const port = 80;

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); 

app.get('/messages', async function(req, res) {
  const messages = await getAllMessages();
  res.render('messages.njk', { messages });
});

app.get('/edit/messages/:id', async function(req, res) {
  const message = await getMessage(req.params.id);
  const occasions = await getAllOccasions();
  res.render('message-form.njk', { message, occasions });
});

app.get('/edit/messages', async function(req, res) {
  const occasions = await getAllOccasions();
  res.render('message-form.njk', { occasions });
});

app.post('/messages', async function(req, res) {
  await createMessage(req.body);
  res.redirect('/messages');
});

app.post('/messages/:id', async function(req, res) {
  await updateMessage(req.params.id, req.body);
  res.redirect('/messages');
});

app.get('/', async function(req, res) {
  const occasions = await getAllOccasions();
  res.render('index.njk', { occasions });
});

app.get('/:name', async function(req, res) {
  const name = req.params.name;
  const occasion = req.query.occasion;
  const occasions = await getAllOccasions();
  const messages = await getMessagesFor(occasion);
  res.render('index.njk', { occasions, messages: 
    messages.map(m => ({...m, message: nunjucks.renderString(m.message, { name })})) });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`GIF Requester listening on port ${port}`)
});