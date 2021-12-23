import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { db } from "../database/index.js";
const PORT = process.env.PORT || 3333;

function defaultHeader(response, cors = false) {
    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": cors ? "*" : ""});
}

const handler = async (request, response) => {
    
    let url = request.url;
    let anime_id = url.split("/")[2];

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

    if(request.url.includes("/delete") && request.method == "DELETE") {
        const sql = "DELETE FROM animes WHERE anime_id = " + anime_id;
        db.query(sql, (err, result) => {
            if(err) throw new Error(err);

            if(result.affectedRows == 0) {
                return response.end(JSON.stringify({ message: "Cannot find this ID!" }));
            }

            return response.end(JSON.stringify({ message: "Successfully deleted" }));
        })
    }

    if(request.url == "/animes" && request.method == "GET") {
        const sql = "SELECT * FROM animes";
        db.query(sql, (err, result) => {
            if(err) throw new Error(err);

            return response.end(JSON.stringify(result))
        })
    }

    if(request.url.includes("/updatename") && request.method == "PUT") {
        for await(const data of request) {
            const { name } = JSON.parse(data);

            if(!name) return response.end(JSON.stringify({
                error: "Cannot be null!"
            }))

            const sql = "UPDATE animes SET name = ? WHERE anime_id = ?"
            db.query(sql, [name, anime_id], (err, result) => {
                if(err) throw new Error(err);

                return response.end(JSON.stringify({
                    message: "Successfully updated!"
                }))
            })
        }
    }

    if(request.url.includes("/updatesinopse") && request.method == "PUT") {
        for await(const data of request) {
            const { sinopse } = JSON.parse(data);

            if(!sinopse) return response.end(JSON.stringify({
                error: "Cannot be null!"
            }))

            const sql = "UPDATE animes SET sinopse = ? WHERE anime_id = ?"
            db.query(sql, [sinopse, anime_id], (err, result) => {
                if(err) throw new Error(err);

                return response.end(JSON.stringify({
                    message: "Successfully updated!"
                }))
            })
        }
    }

    if(request.url.includes("/updatecover") && request.method == "PUT") {
        for await(const data of request) {
            const { cover } = JSON.parse(data);

            if(!cover) return response.end(JSON.stringify({
                error: "Cannot be null!"
            }))

            const sql = "UPDATE animes SET cover = ? WHERE anime_id = ?"
            db.query(sql, [cover, anime_id], (err, result) => {
                if(err) throw new Error(err);

                return response.end(JSON.stringify({
                    message: "Successfully updated!"
                }))
            })
        }
    }
}

http.createServer(handler).listen(PORT, () => console.log("Server is running..."));