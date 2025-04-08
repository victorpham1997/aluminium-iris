import { GoogleGenAI, Content} from "@google/genai";
import { NextResponse } from 'next/server';
import { type } from 'os';


const apiKey = "";
const ai = new GoogleGenAI({apiKey: apiKey});
const model = "gemini-2.0-flash";
const systemInstruction = "You are a close friend, respond as if you want to help the user.";

// const model = genAI.getGenerativeModel({model: "gemini-2.0-flash" });


export async function POST(request) {
    try{
        const chatHistory = await request.json();
        if (!Array.isArray(chatHistory)){
            return NextResponse.json({error: "Invalid chat history format"}, {status: 400});
        }

        console.log("Sending request to Google API");
        console.log(JSON.stringify(chatHistory));

        const response = await ai.models.generateContentStream({
            model: model,
            contents: chatHistory,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        for await (const chunk of response) {
            console.log(chunk.text);
        }

        console.log("Raw API response:", {response});

        if(!response || typeof response !== "object"){
            console.error("API returned invalid response:",  response);
            return NextResponse.json({error: "Gemeni API returned invalid response"}, {status: 500});
        };

        const {readable, writable} = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        (async () => {
            try {
                for await (const chunk of response.stream) {
                    console.log("Chunk received:", chunk);
                    if(chunk.text){
                        await writer.write(encoder.encode(chunk.text() + "\n"));
                    }
                }
            }catch(error){
                console.error("Unable to process Gemini API response stream");
            }finally{
                writer.close();
            }
        })();

        return new Response( readable, {
            headers: ({"Content-Type" : "text/plain"})
        });

    }catch(error){
        console.error("Error generating content:", error);
        return NextResponse.error();
    }
}