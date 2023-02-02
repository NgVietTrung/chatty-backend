import { BlockUser } from '@block/controllers/block-user';
import { authMiddleware } from '@global/helpers/auth-middleware';
import express, { Router } from 'express';

class BlockRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, BlockUser.prototype.block);
    this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, BlockUser.prototype.unblock);
    return this.router;
  }
}

export const blockRoutes: BlockRoutes = new BlockRoutes();
