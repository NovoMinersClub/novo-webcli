const express = require('express');
const app = express();
const { exec } = require('child_process');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/command', (req, res) => {
  const { command } = req.body;
  exec(`novo-cli ${command}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(error.message);
      return;
    }
    if (stderr) {
      res.status(500).send(stderr);
      return;
    }
    res.send(stdout);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('Novo app listening at http://localhost:' + port);
});
