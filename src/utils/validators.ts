import { body } from 'express-validator';

export const validateSendMessage = [
  body('message')
    .isLength({ min: 1 })
    .withMessage('Message must be at least 1 characters long'),
];

export const validateUpdateContext = [
  body('context')
    .isIn(['Normal', 'CheckIn', 'SuicideRisk'])
    .withMessage('The context value must be one of Normal,CheckIn,SuicideRisk'),
];
