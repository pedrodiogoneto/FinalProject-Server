const mongoose = require('mongoose');
const dbName = 'illdoit';

// connect to the database
mongoose.connect(`mongodb://localhost/illdoit`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the illdoit database`);
});
