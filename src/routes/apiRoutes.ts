import * as express from 'express';
import * as validator from '../utils/validators';
import * as intentController from '../controllers/intendController';
import { userAuthMiddleware } from '../middlewares/authMiddleware';
const ApiRoutes = express.Router();

ApiRoutes.get(
  '/retrieveContext',
  [userAuthMiddleware],
  intentController.retrieveContextController
);

ApiRoutes.post(
  '/sendMessage',
  [...validator.validateSendMessage, userAuthMiddleware],
  intentController.sendMessageController
);

ApiRoutes.post(
  '/initiateCheckIn',
  [userAuthMiddleware],
  intentController.initialCheckInController
);

ApiRoutes.post(
  '/updateContext',
  [...validator.validateUpdateContext, userAuthMiddleware],
  intentController.updateContextController
);

export default ApiRoutes;
