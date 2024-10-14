import { NextFunction, Request, Response } from 'express';
import { IntentHandler } from '../services/intent';
import { getContext, updateContext } from '../configs/redisConfig';
import { validationResult } from 'express-validator';

/**
 * initial check-in Controller :  path /api/initiateCheckIn &  Authentication required
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const initialCheckInController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { uid } = req.query;
    const intent = new IntentHandler();
    const intentRes = intent.CheckInFlow();

    await updateContext(`${uid}`, intent.currentFlow);

    return res.json({ message: intentRes });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Send Message Controller :  path /api/sendMessage &  Authentication required
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { message } = req.body;
    const { uid } = req.query;
    const intent = new IntentHandler();
    const intentRes = intent.handleMessage(message);

    await updateContext(`${uid}`, intent.currentFlow);

    return res.json({ message: intentRes });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * retrieve Context Controller:  path /api/retrieveContext &  Authentication required
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const retrieveContextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { uid } = req.query;
    const context = await getContext(uid as string);
    return res.json({ context });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * update Context Controller:  path /api/updateContext &  Authentication required
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateContextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { context } = req.body;
    const { uid } = req.query;

    await updateContext(`${uid}`, context);

    return res.status(200).json({ message: 'user context updated' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
