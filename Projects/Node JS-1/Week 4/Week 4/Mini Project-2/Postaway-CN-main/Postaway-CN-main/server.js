import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './src/features/user/routes/user.routes.js';
import { errorHandlerMiddleware } from './src/middleware/error.middleware.js';
import { invalidRoutesHandlerMiddleware } from './src/middleware/invalidRoute.middleware.js';
import cookieParser from 'cookie-parser';
import postRouter from './src/features/post/routes/post.routes.js';
import jwtAuth from './src/middleware/jwtAuth.middleware.js';
import commentRouter from './src/features/comment/routes/comment.routes.js';
import likeRouter from './src/features/like/routes/like.routes.js';
import loggerMiddleware from './src/middleware/logger.middleware.js';

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(loggerMiddleware);

//paths
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', jwtAuth, postRouter);
app.use('/api/v1/comments', jwtAuth, commentRouter);
app.use('/api/v1/likes', jwtAuth, likeRouter);

//invalid routes
app.use(invalidRoutesHandlerMiddleware);

//error handling
app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log('server listening on 3000');
});
