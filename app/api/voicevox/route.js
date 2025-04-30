import { NextResponse } from 'next/server';
// https://melodyxpot.medium.com/how-to-add-speech-to-text-into-your-next-js-app-af7f008f9d7b

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