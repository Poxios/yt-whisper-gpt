"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 5000;
app.get('/convert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { youtubeUrl } = req.query;
    let resultString = "";
    try {
        const pythonProcess = (0, child_process_1.spawn)('python', ['main.py', youtubeUrl]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            resultString += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        yield new Promise((resolve, reject) => {
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
    }
    catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).send('An error occurred');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
