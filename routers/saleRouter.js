const express = require("express");
const { Sale } = require("../models/index");
const router = express.Router();
const upload = require("./uploadImage");
router.post("/", upload.single("photo"));

// 상품 등록
router.post("/", async (req, res, next) => {
  //객체 만듬
  const newPost = req.body;
  // auth에서 넣어준값
  newPost.userID = req.userID;
  // imageRouter에서 보내준 파일 이름
  newPost.photo = req.filename;
  console.log(req.body.price);
  newPost.price = parseInt(req.body.price);
  console.log(newPost);
  try {
    const result = await Sale.create(newPost);
    console.log(result);
    // price 형변환 - int
    result.price = parseInt(result.price);
    res
      .status(201)
      .json({ success: true, documents: [result], message: "post 등록 성공" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  // pagination
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.size) || 10;

  // 갯수
  const limit = pageSize;
  // 시작점
  const offset = (page - 1) * pageSize;
  try {
    const result = await Sale.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
    // 전체 페이지 수
    const totalPages = Math.ceil(result.count / pageSize);
    res.status(200).json({
      success: true,
      documents: result.rows,
      totalPages: totalPages,
      message: "sales 조회성공",
    });
  } catch (err) {
    next(err);
  }
});

// 상세 조회
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const options = {
    where: {
      id: id,
    },
  };
  try {
    const result = await Sale.findAll(options);
    res
      .status(200)
      .json({ success: true, documents: result, message: "sale 조회성공" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
