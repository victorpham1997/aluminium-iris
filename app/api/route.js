import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { type } from 'os';


const apiKey = "";
const genAI = new GoogleGenerativeAI({apiKey});
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash" });

export async function POST(request) {
    try{
        const chatHistory = await request.json();
        if (!Array.isArray(chatHistory)){
            return NextResponse.json({error: "Invalid chat history format"}, {status: 400});
        }

        const prompt = "You are a close friend, respond as if you want to help the user.";
        console.log("Sending request to Google API");

        const response = await model.generateContentStream({
            contents: chatHistory,
            systemInstruction: prompt
        });

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