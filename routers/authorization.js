const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authorization = async (req, res, next) => {
  const auth = req.get("Authorization");

  // Bearer+space
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized-Bearer token 인증을 사용하십시오." });
  }
  // 가공해서 순수 토큰
  const token = auth.split(" ")[1];

  // 발행 토큰 여부 확인
  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      // 이럴 경우 FE - UI 로그인 화면
      return res.status(403).json({
        message: "Unauthorized-token이 유효하지 않습니다.",
      });
    } else {
      // req에 넘김
      req.userID = decoded.uid;
      req.role = decoded.rol;
      next();
    }
  });
};

module.exports = authorization;
