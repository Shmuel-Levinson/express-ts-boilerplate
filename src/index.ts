// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { log } from "console";
type Thing = {
	id: number;
	name: string;
	dimensions: 1 | 2 | 3;
};
dotenv.config();

function fullDateTime() {
  const now = new Date();
  
  const date = now.toISOString().slice(0,10);
  const time = now.toTimeString().slice(0,8);
  const milliseconds = now.getMilliseconds();
  
  return (`${date} ${time}.${milliseconds}`); 
}


const app: Express = express();
app.use(express.json());
app.use((req: Request, res: Response, next: Function) => {
	const token = req.header("Authorization");
	log("intercepted!");
	req.body.date = fullDateTime()

	log(token);
	next();
});

const port = process.env.PORT || 3000;
const db: { things: Thing[] } = {
	things: [],
};
app.post("/add", (req: Request, res: Response) => {
	log("body", req.body);
	log("query", req.query);
	const r: Thing = req.body as Thing;
	db.things.push(r);
	res.send(db.things);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
