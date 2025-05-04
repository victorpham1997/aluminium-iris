import { NextResponse } from 'next/server';
// https://melodyxpot.medium.com/how-to-add-speech-to-text-into-your-next-js-app-af7f008f9d7b

const VOICEVOX_API_KEY = 'N5y492108606g-5'
// 'https://deprecatedapis.tts.quest/v2/voicevox/audio/?text='

export async function POST(request) {
    try{
        const japaneseInput = request;
        const response = await fetch(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${japaneseInput}&key=${VOICEVOX_API_KEY}`, 
            {method: 'GET'});

        console.log("Sending request to VoiceVox su-shiki server");
        console.log(japaneseInput);

        if(!response.ok){
            console.error("VoiceVox su-shiki server returned invalid response:",  response);
            return NextResponse.json({error: "VoiceVox su-shiki server returned invalid response"}, {status: 500});
        };

        return new NextResponse(response.body, {headers:{'Content-Type': 'audio/wav'} })

    }catch(error){
        console.error("Error generating content:", error);
        return NextResponse.error();
    }
}