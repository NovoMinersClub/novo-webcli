const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/receive', (req, res) => {
  res.sendFile(__dirname + '/public/receive.html');
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

app.get('/backup-wallet', (req, res) => {
  const backupFilePath = path.join('/app', 'wallet-dump.txt');
  exec('novo-cli dumpwallet ' + backupFilePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error generating wallet dump.');
    }

    fs.readFile(backupFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error: ${err.message}`);
        return res.status(500).send('Error reading wallet dump file.');
      }
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename=wallet-dump.txt');
      res.send(data);
    });
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Novo app listening at http://localhost:${port}`);
});

