import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import auth from 'basic-auth';

// Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const user = auth(req);
  if (user && user.name === 'admin' && user.pass === 'password') { // Replace with your credentials
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
  }
};

// Validation function
const validateNote = (title, content) => {
  const errors = {};
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < 3 || title.length > 100) {
    errors.title = "Title must be between 3 and 100 characters.";
  }

  if (!content) {
    errors.content = "Content is required.";
  } else if (content.length < 10 || content.length > 1000) {
    errors.content = "Content must be between 10 and 1000 characters.";
  }

  return errors;
};


dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// BodyParser Middleware
app.use(bodyParser.json());
app.use(basicAuth);
// Note Model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});
const Note = mongoose.model('Note', noteSchema);
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send({ error: 'An unexpected error occurred' });
});
// Create Note Endpoint
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  const errors = validateNote(title, content);
  if (Object.keys(errors).length > 0) {
    return res.status(400).send({ errors });
  }

  try {
    const note = new Note({
      title,
      content,
      updatedAt: new Date(),
    });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Retrieve Notes Endpoint
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve Single Note Endpoint
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('Note not found');
    res.send(note);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Update Note Endpoint
app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const errors = validateNote(title, content);
  if (Object.keys(errors).length > 0) {
    return res.status(404).send({ errors });
  }

  try {
    const note = await Note.findByIdAndUpdate(req.params.id, {
      title,
      content,
      updatedAt: new Date(),
    }, { new: true });
    if (!note) return res.status(404).send('Note not found');
    res.send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Delete Note Endpoint
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).send('Note not found');
    res.send(note);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;