import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { db } from "../database/index.js";
const PORT = process.env.PORT || 3333;

function defaultHeader(response, cors = false) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": cors ? "*" : ""});
}

const handler = (request, response) => {
    
    if(request.url == "/" && request.method == "GET") {
        defaultHeader(response);

        return response.end(JSON.stringify({
            message: "Hello world!"
        }))
    }
}

http.createServer(handler).listen(PORT, () => console.log("Server is running..."));