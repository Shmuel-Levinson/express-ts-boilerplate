import express, {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from "cors";
import bodyParser from 'body-parser';
import {getGroqResponse, getGroqResponseWithDefinitionPrompt, systemMessage, userMessage} from "./groq/groq-api";
import {log} from "console";
import {getCompletion} from "./open-ai/open-ai-api";
import {FilterAgent} from "./ai/agents/filter-agent";
import {ParserAgent} from "./ai/agents/parser-agent";


dotenv.config();
const app = express();
const corsOptions = {
    origin: process.env.ENV === 'PROD' ? 'https://www.my-app.com' : 'http://localhost:5173',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};
app.use(cors(corsOptions));
app.use(helmet()); // Security middleware
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({extended: true})); // Parse URL-encoded request bodies


app.get('/ping', async (req: Request, res: Response, next: NextFunction) => {

    res.send('pong');
    log('pinged');
});

app.post('/prompt', async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const prompt = body.prompt;
    const history = body.history;
    const response = await getGroqResponse(prompt, history);
    res.send(response);
    log('asked');
});

app.post('/prompt-with-definition', async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const prompt = body.prompt;
    const history = body.history;
    const definitionPrompt = body.definitionPrompt;
    const response = await getGroqResponseWithDefinitionPrompt(definitionPrompt, prompt, history);
    res.send(response);
    log('asked');
})

app.post('gpt', async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const prompt = body.prompt;
    const response = await getCompletion(prompt);
    res.send(response);
    log('asked');
})

app.post('/update-filter', async (req: Request, res: Response) => {
    const body = req.body;
    const response = await FilterAgent.getResponse(body);
    res.send(response);
})

app.post('/parse-user-prompt', async (req: Request, res: Response) => {
    const body = req.body;
    const response = await ParserAgent.getResponse(body);
    if(!response?.response){
        response.response = "Sorry, I couldn't parse your prompt. Please try again."
    }
    res.send(response);
})

app.post('/update-filter-mock', async (req: Request, res: Response) => {
    console.log("update-filter-mock");
    res.send({
        dateRange: {
            start: '',
            end: ''
        },
        minSumFilter: 100,
        maxSumFilter: 500,
        typeFilter: 'all',
        categoryFilter: ['travel']
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // getCompletion("Hello, OpenAI!!").then(r => {
    //     console.log(r);
    // });
});
