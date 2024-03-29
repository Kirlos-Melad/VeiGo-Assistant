import { io, Socket } from "socket.io-client";
import Logger from "../utilities/Logger";

class AIManager {
    private socket: Socket;

    constructor(connection: string) {
        this.socket = io(connection);
    }

    public async Start(){
        return new Promise((resolve, reject) => {
            this.socket.on("connect", () => {
                resolve(this.socket.connected);
            });

            this.socket.on("connect_error", (error: any) => {
                reject(error);
            });

            this.socket.on("connect_timeout", () => {
                reject("Connection to AI server timed out");
            });

            this.socket.on("error", (error: any) => {
                reject(error);
            });
            
            this.socket.on("reconnect", (attempt: any) => {
                Logger.warning(`Reconnected to AI server on attempt ${attempt}`);
            });

            this.socket.on("reconnect_attempt", (attempt: any) => {
                Logger.warning(`Reconnecting to AI server on attempt ${attempt}`);
            });

            this.socket.on("reconnect_error", (error: any) => {
                reject(error);
            });

            this.socket.on("reconnect_failed", () => {
                reject("Failed to reconnect to AI server");
            });

            this.socket.on("disconnect", (reason: any) => {
                reject(reason);
            });

            if (this.socket.connected) {
                resolve(true);
            }
        });
        
    }

    public async Ask(question: string): Promise<string>{
        return new Promise((resolve, reject) => {
            this.socket.once("response", (response: string) => {
                resolve(response);
            });
            
            this.socket.emit("ask", question)
        });
    }
}


export default AIManager;
