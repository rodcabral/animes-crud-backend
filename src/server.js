import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { db } from "../database/index.js";
const PORT = process.env.PORT || 3333;

function defaultHeader(response, cors = false) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": cors ? "*" : ""});
}

const handler = async (request, response) => {
    
    if(request.url == "/" && request.method == "GET") {
        defaultHeader(response);

        return response.end(JSON.stringify({
            message: "Hello world!"
        }))
    }

    if(request.url == "/new" && request.method == "POST") {
        for await (const data of request) {
            const { name, sinopse, cover } = JSON.parse(data);

            if(!name || !sinopse || !cover) {
                return response.end(JSON.stringify({
                    error: "Invalid informations"
                }))
            }

            const id = Math.floor(Math.random() * 9999);

            const date = new Date();

            const newData = {
                id,
                name,
                sinopse,
                cover,
                date
            }
          
            db.query("INSERT INTO animes(creation_date, anime_id, name, sinopse, cover) VALUES (?, ?, ?, ?, ?)", [date, id, name, sinopse, cover], 
                (error, result) => {
                    if(error) throw new Error(error);
        
                    return response.end(JSON.stringify(newData))
                }
            );

        }
    }
}

http.createServer(handler).listen(PORT, () => console.log("Server is running..."));