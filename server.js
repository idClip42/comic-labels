import { LoadComicsData } from "./loadComicsData/index.js";
import CONFIG from "./config.json" assert { type: 'json' };
import { ConvertToLabelData } from "./convertToLabelData/index.js";
import express from "express";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

LoadComicsData(
    CONFIG.volumeUrls,
    CONFIG.getIndivPageData
).then(result => {
    const labelData = ConvertToLabelData(result);
    console.log(`${labelData.length} labels.`);

    console.log("Starting server...");
    const app = express();
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
    app.get("/styles.css", function(req, res) {
        res.sendFile(path.join(__dirname, "public/styles.css"));
    });
    app.get("/client.js", function(req, res) {
        res.sendFile(path.join(__dirname, "public/client.js"));
    });
    app.get("/config", function(req, res) {
        res.send(labelData);
    });
    app.listen(CONFIG.port);
    console.log(`Server listening on port ${CONFIG.port}`);
});