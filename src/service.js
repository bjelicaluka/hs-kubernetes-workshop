const { DocumentStore } = require('ravendb');

const store = new DocumentStore(process.env.DATABASE_URL || 'http://localhost:8080',
  process.env.DATABASE_NAME || 'HS');
store.initialize();

async function getAllOccasions() {
  const session = store.openSession();
  return session.query({ collection: 'occasions'}).all();
}

async function getAllMessages() {
  const session = store.openSession();
  const messages = await session.query({ collection: 'messages'}).all();
  return Promise.all(messages.map(async (m) => ({
    ...m,
    lastModified: m['@metadata']['@last-modified'],
    occasion: await session.load(m.occasion)
  })))
}

async function getMessagesFor(occasion) {
  const session = store.openSession();
  return session.query({ collection: 'messages'})
    .whereEquals("occasion", occasion)
    .all();
}

async function getMessage(messageId) {
  const session = store.openSession();
  return session.load(`messages/${messageId}`);
}

async function updateMessage(messageId, message) {
  const session = store.openSession();
  const existingMessage = await session.load(`messages/${messageId}`);
  existingMessage.occasion = message.occasion;
  existingMessage.gif = message.gif;
  existingMessage.message = message.message;
  await session.saveChanges();
}

async function createMessage(message) {
  const session = store.openSession();
  await session.store({...message, '@metadata': { '@collection': 'Messages' }}, `messages/`);
  await session.saveChanges();
}

module.exports = {
  getAllMessages,
  getMessage,
  getAllOccasions,
  createMessage,
  updateMessage,
  getMessagesFor
}