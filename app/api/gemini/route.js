import { GoogleGenAI, Content} from "@google/genai";
import { NextResponse } from 'next/server';
import { type } from 'os';


const apiKey = "AIzaSyBeSVg3iXPSniDzmhVHYwWEgV5dtubHCMU";
const ai = new GoogleGenAI({apiKey: apiKey});
const model = "gemini-2.0-flash";
const systemInstruction = `あなたは日本の技術会社の経験豊富なマネージャーです。
あなたは候補者を面接しています。
あなたの仕事は候補者を面接の基本的な質問や技術について質問することです。

面接の基本的な質問の例は：
１。自己紹介
２。弊社に応募の理由
３。長所と短所は何ですか

技術について質問の例は：
１。開発経験について教えてください
２。仕事上の業績で最も誇りに思っていることは何ですか？また、どのように達成しましたか？

質問できるのは6つまでです。6つの質問が終わったら、面接を終了するようにしてください。
候補者は「失礼します」って言ってから、面接は始めます。`

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
        
        // for await (const chunk of response) {
        //     console.log(chunk.text);
        // }

        // console.log("Raw API response:", {response});

        if(!response || typeof response !== "object"){
            console.error("API returned invalid response:",  response);
            return NextResponse.json({error: "Gemeni API returned invalid response"}, {status: 500});
        };

        const {readable, writable} = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        (async () => {
            try {
                for await (const chunk of response) {
                    if(chunk.text){
                        // console.log('')
                        console.log(chunk.text);
                        await writer.write(encoder.encode(chunk.text + "\n"));
                    }
                }

            }catch(error){
                console.error("Unable to process Gemini API response stream: ", error);
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