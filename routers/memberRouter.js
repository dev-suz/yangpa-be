const express = require("express");
const { User } = require("../models/index");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { RequestPolicyOptions } = require("@azure/storage-blob");
const secret = process.env.JWT_SECRET;

const createHash = async (password, saltRound) => {
  let hashed = await bcrypt.hash(password, saltRound);
  console.log(hashed);
  return hashed;
};

// sign-up 회원가입
router.post("/sign-up", async (req, res, next) => {
  const member = req.body;
  // 암호회
  const newPassword = await createHash(member.password, 10);
  member.password = newPassword;
  console.log(member);
  try {
    const result = await User.create(member);
    res.status(201).json({
      success: true,
      member: result,
      message: "회원가입이 완료되었습니다.",
    });
  } catch (err) {
    next(err, req, res);
  }
});

// sign-in 로그인
router.post("/sign-in", async (req, res, next) => {
  const { userName, password } = req.body;
  const options = {
    attributes: ["password", "userName", "id"],
    where: { userName: userName },
  };
  try {
    const result = await User.findOne(options);
    if (result) {
      const compared = await bcrypt.compare(password, result.password);
      if (compared) {
        // payload로  uid , role 같이 넘김, salt값 같이 보냄
        const token = jwt.sign({ uid: result.id, rol: "admin" }, secret);
        res.status(200).json({
          success: true,
          token: token,
          member: {
            userName,
            userName: result.userName,
          },
          // 메세지 OO님 환영합니다 ~ 같은류.
          message: "로그인에 성공했습니다.",
        });
      } else {
        // 401 인증
        res.status(401).json({
          message: "비밀번호가 잘못되었습니다.",
        });
      }
    } else {
      res.status(404).json({
        message: "존재하지않는 아이디입니다.",
      });
    }
  } catch (err) {
    next(err);
  }
});

// APNS - 스마트폰에서 push noti
// router.post("/regist-apns", async (req, res, next) => {
//   console.log(req.body);
//   const { userName, deviceToken } = req.body;
//   try {
//     const result = await User.update(
//       { deviceToken: deviceToken },
//       { where: { userName: userName } }
//     );
//     if (result) {
//       res.status(200).json({
//         success: true,
//         member: {
//           userName: userName,
//         },
//         message: "device token 등록에 성공했습니다.",
//       });
//     } else {
//       res.status(404).json({
//         message: "존재하지않는 아이디입니다.",
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
