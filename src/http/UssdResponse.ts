import { UssdResponseInterface } from "interfaces/ussd-response-interface";
import { Response } from "express";
import {convert} from 'xmlbuilder2';
interface Premium
 {
    cost: number,
    ref: string;
 }
interface USSD
 {
    type: number;
    msg: string;
    premium?: Premium
}

interface IUssdResult {
    ussd?:USSD;
}
export class UssdResponse implements UssdResponseInterface {

    private response: Response;

    /** @var string */
    private message: string;

    /** @var int */
    private type: number;

    constructor(res: Response, result: any) {
        this.response = res;
        const r = convert(result, {format: 'object'});
        this.type = r['ussd'].type;
        this.message = r['ussd'].msg;
        console.log(this.message);
    }

    render(): void {
        const resType = this.interactive() ? 'CON' : 'END';
        this.response.send(`${resType} ${this.message}`);
    }
    successful(): boolean {
        return true;
    }
    interactive(): boolean {
        return this.type == 2;
    }
}