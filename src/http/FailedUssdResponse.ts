import { UssdResponseInterface } from "interfaces/ussd-response-interface";
import { Response } from "express";

export class FailedUssdResponse implements UssdResponseInterface {
    private response: Response;

    /** @var string */
    private message = "Network Error";

    /** @var int */
    private type: number;

    constructor(res: Response, result: any) {
        this.response = res;
        this.type = 3;
    }

    render() {
        this.response.send(`END ${this.message}`);
    }
    successful(): boolean {
        return false;
    }
    interactive(): boolean {
        return false;
    }
}