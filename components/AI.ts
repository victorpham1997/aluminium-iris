import { GoogleGenAI } from "@google/genai";

export class AI{
    private _API_KEY: string = "";
    private _ai!: GoogleGenAI;
    keyApproved = false;

    // constructor(API_KEY: string) {
    //     this.API_KEY = API_KEY;
    // }

    public setKey(API_KEY: string){
        if (API_KEY.trim() == ""){
            throw new Error("API Key is empty or invalid");
        }
        try{
            this.initModel(API_KEY);
            this._API_KEY = API_KEY;
            this.keyApproved = true;
        }catch(error){
            this.keyApproved = false;
            throw new Error("API Key is empty or invalid");

        }
    }

    initModel(apiKey: string){
        this._ai = new GoogleGenAI({ apiKey: apiKey});
    }

    initChat(){
        if(!this.keyApproved){
            throw new Error("API Key is empty or invalid");
        }
        

    }


    
}