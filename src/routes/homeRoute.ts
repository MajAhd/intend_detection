import * as express from 'express';

const HomeRoutes = express.Router();

HomeRoutes.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to Intent Detection api!',
  });
});

export default HomeRoutes;
