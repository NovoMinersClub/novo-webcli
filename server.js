const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/command', (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.send(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.send(`Error: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    res.send(stdout);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Novo app listening at http://localhost:${port}`);
});
