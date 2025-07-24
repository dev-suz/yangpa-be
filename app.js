// model 읽어옴 (DB 정보 읽어서 테이블 스키마 생성)
// require("./models/sync")();
require("dotenv").config();

const express = require("express");
// 개발 관련 정보 console 출력 - dev env에서 사용 용.
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const app = express();

// Router
const memberRouter = require("./routers/memberRouter");
const saleRouter = require("./routers/saleRouter");
// DB에서 이미지 url 쓸거라 여기선 안함
const imageRouter = require("./routers/imageRouter");
// 토큰 관련
const authorization = require("./routers/authorization");
const errorHandler = require("./routers/errorHandler");

app.use(morgan("dev"));

//  req.body 에 넣어줌.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/sales", authorization);
app.use("/sales", saleRouter);
app.use("/members", memberRouter);
app.use("/members", errorHandler);

// app.use('/images', imageRouter);
app.use((_, res) => {
  res.status(404).json({
    message: "존재하지 않은 API입니다. path와 method를 확인하십시오.",
  });
});
app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
