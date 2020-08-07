const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { getMyPlace, getTripInfo } = require('../service/manage-trip');

const router = express.Router();

/**
 * @api {get} /trip-info 1. Trip Info
 * @apiName trip info
 * @apiGroup 3. Trip
 *
 * @apiParam pos 조회하기 시작하는 인덱스 값 default = 0
 * @apiParam offset 몇 개 가져올 것인지 선택 default = 5
 * @apiParam order 정렬 순서 선택 0-bascket, 1-title, 2-location, 3-view count
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/', authenticateUser, async (req, res, next) => {
  let tripInfoResult;
  try {
    // eslint-disable-next-line max-len
    tripInfoResult = await getMyPlace(req.user.id, req.query.pos, req.query.offset, req.query.order);
  } catch (err) {
    console.error('trip info error');
    console.error(err.message);
    throw err;
  }
  res.send(tripInfoResult);
});

/**
 * @api {get} /trip-info/detail/:contentId 2. Detail Info
 * @apiName detail info
 * @apiGroup 3. Trip
 *
 * @apiParam contentId
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/detail/:contentId', authenticateUser, async (req, res, next) => {
});

// 추천하는 장소용: query로 위도, 경도 필요 (location based 쓸 예정)
/**
 * @api {get} /location 3. Recommend Location
 * @apiName recommend location
 * @apiGroup 3. Trip
 *
 * @apiParam locationX
 * @apiParam locationY
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/location', authenticateUser, async (req, res, next) => {
});

// 시군구 위치에 따른 여행지 추천, query로 areaCode, sigungu Code 필요 (area Based)
/**
 * @api {get} /place 4. Area Based Place
 * @apiName area based place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/place', authenticateUser, async (req, res, next) => {
});

// 근처 숙소 필요
/**
 * @api {get} /room 5. Room Place
 * @apiName room place
 * @apiGroup 3. Trip
 *
 * @apiParam areaCode
 * @apiParam [sigunguCode] optional
 *
 * @apiSuccess {JSON} message
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *  }
 */
router.get('/room', authenticateUser, async(req, res, next) => {
});

module.exports = router;
