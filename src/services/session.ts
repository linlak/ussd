import  {FailedUssdResponse} from "../http/FailedUssdResponse";
import  {UssdResponse} from "../http/UssdResponse";

import {create} from 'xmlbuilder2';

import { Response, Request } from 'express';
import UssdBlock from "../interfaces/ussd-block";

const rp = require('request-promise');
 
class Session {
    private url =process.env.USSD_URL|| 'http://localhost:8000/api/ussd';
    private phone:string;
    private id:number|string;
    private msg: any;
    private res: Response;
    private req: Request;
    private hasPayload: boolean;
    //required post key name
    private phoneKey: string = process.env.USSD_PHONE_KEY || 'phoneNumber'; // phoneNumber, msisdn
    private sessionKey: string = process.env.USSD_PHONE_KEY || 'sessionid'; // sessionid, sessionId
    private messageKey: string = process.env.USSD_MSG_KEY || 'text'; // text, msg
    
    constructor(req: Request, res: Response, options: UssdBlock =null) {
        
        this.req = req;
        this.res = res;
       if(!!options) {
        if(options.USSD_MSG_KEY) {
            this.messageKey = options.USSD_MSG_KEY
        }
        if (options.USSD_SESSION_KEY) {
            this.sessionKey = options.USSD_SESSION_KEY
        }
        if (options.USSD_PHONE_KEY) {
            this.phoneKey = options.USSD_PHONE_KEY
        }
        if (options.USSD_URL) {
            this.url = options.USSD_URL;
        }}

    }

    public start() {
        this.phone= this.req.body[this.phoneKey];
        this.id= this.req.body[this.sessionKey];
        this.phone= this.req.body[this.phoneKey];
        
        this.parseMsg();
    }
    private parseMsg(): any {
        let text = this.req.body[this.messageKey];
        if(!!text) {

            const msgs: any[] = text.split('*');
            this.msg = msgs[msgs.length - 1];
            if(!!this.msg) {
                this.hasPayload = true;
            } else {
                return this.res.send('END Empty values not accepted')
            }

            // this.res.send(this.msg);
            // return;

        } else {
            this.hasPayload = false;
        }

        if(!this.hasPayload){
            this.initialize();
        } else {
            this.responde(this.msg)
        }
        
    }
   public  initialize() {
        this.send(1,1,this.res);
    }
    public responde(message: any) {
        this.send(message, 2, this.res);
    }
    public send(message:number|string, type: number, res: Response) {
        const options = {
            uri: this.url,
            method: 'POST',
            body:this.parseBody(message,type),
            headers: {
                'User-Agent': 'Request-Promise'
            },
        };
        // console.log(options);
        rp(options)
    .then(function (result) {
        (new UssdResponse(res,result)).render();
    })
    .catch(function (err) {
        (new FailedUssdResponse(res, err)).render();
    });
    }
    public parseBody( msg: any=1, type: number=2): string {
        // return `<ussd><msisdn>${this.phone}<msisdn><sessionid>${this.id}</sessionid><type>${type}<type><msg>${msg}<msg></ussd>`;
        return create()
        .ele('ussd')
        .ele('msisdn').txt(`${this.phone}`).up()
        .ele('sessionid').txt(`${this.id}`).up()
        .ele('type').txt(`${type}`).up()
        .ele('msg').txt(`${msg}`).up()
        .up().toString();
    }
}
export default Session;