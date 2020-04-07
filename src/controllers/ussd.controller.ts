import IControllerBase from "interfaces/IControllerBase.interface";
import * as express from 'express';
import { Request, Response } from 'express'
import Session from "../services/session";

import ussd_config = require('../config/ussd-config.example.json')

 class UssdController implements IControllerBase  {
    public path = '/'
    public router = express.Router()

    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.index);
        this.router.post('/ussd', this.ussd);
    }

    index = (req: Request, res: Response) => {
        res.send('Server is live');
    }
    ussd = (req: Request, res: Response) => {
        (new Session(req, res)).start();
    }

     example_ussd = (req: Request, res: Response) => {
         (new Session(req, res, ussd_config)).start();
     }
}

export default UssdController;