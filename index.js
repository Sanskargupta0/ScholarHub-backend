require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const connectDB = require("./server/utils/db");
const admin = require("firebase-admin");
const errorMiddleware = require("./server/middleware/error_middleware");
const contactRouter = require("./server/router/contact-router");
const authRouter = require("./server/router/auth-router");
const userRouter = require("./server/router/userData-router");
const notificationRouter = require("./server/router/notification-router");
const adminRouter = require("./server/router/admin-router");
const courseRouter = require("./server/router/course-router");
const semesterRouter = require("./server/router/semester-router");
const paperRouter = require("./server/router/paper-router");
const awsS3Router = require("./server/router/s3-bucket-router");
const socketIo = require('socket.io');
const serviceAccount = require("./server/utils/firebase");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  io.emit('userCount', io.engine.clientsCount);

  socket.on('authenticate', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    io.emit('userCount', io.engine.clientsCount);
  });
});


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("ScholarHub Backend");
});
app.use("/", contactRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", notificationRouter);
app.use("/admin", adminRouter);
app.use("/", courseRouter);
app.use("/", semesterRouter);
app.use("/", paperRouter);
app.use("/", awsS3Router);
app.use(errorMiddleware);

const port = process.env.Port || 3000;

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});