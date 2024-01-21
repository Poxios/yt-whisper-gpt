import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';
const app = express();
app.use(cors());
const port = 5000;

app.get('/convert', async (req, res) => {

  const { youtubeUrl } = req.query as any;
  let resultString = "";


  try {
    const pythonProcess = spawn('python', ['main.py', youtubeUrl]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resultString += (data as any).toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    await new Promise<void>((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send(resultString);
        resolve();
      });

      pythonProcess.on('error', (error) => {
        console.error(`An error occurred: ${error}`);
        res.status(500).send('An error occurred');
        reject(error);
      });
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
