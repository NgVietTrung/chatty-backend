import { notificationRoutes } from './features/notifications/routes/notificationRoutes';
import { commentRoutes } from './features/comments/routes/commentRoutes';
import { authRoutes } from './features/auth/routes/authRoutes';
import { Application } from 'express';
import { serverAdapter } from '@service/queues/base.queue';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionRoutes } from '@reaction/routes/reactionRoutes';
import { followerRoutes } from '@follower/routes/followerRoutes';
import { blockRoutes } from '@block/routes/blockRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, blockRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
  };

  routes();
};
