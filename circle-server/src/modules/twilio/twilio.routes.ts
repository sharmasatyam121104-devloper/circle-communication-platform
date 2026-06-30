import { Router } from "express";
import { getTurnServer } from "./twilio.controller";

const TwilioRouter = Router()

TwilioRouter.get('/', getTurnServer)

export default TwilioRouter;