const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Triage Core Backend Running');
});

// Endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const caseRoutes = require('./routes/cases');
app.use('/api/cases', caseRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
