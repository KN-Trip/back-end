const {
  callService, baseParams, models, checkPlaceInfo, itemsToResult, sortItems,
} = require('./init-module');
const { getTotalTest } = require('./manage-test');

function addCategoryParams(params, categoryCode) {
  if (categoryCode.cat1) {
    params.params.cat1 = categoryCode.cat1;
  }
  if (categoryCode.cat2) {
    params.params.cat2 = categoryCode.cat2;
  }
  if (categoryCode.cat3) {
    params.params.cat3 = categoryCode.cat3;
  }
}

function mixResult(itemArr) {
  let i = 0;
  let x;
  const newItems = [];
  while (itemArr.length > 0) {
    x = Math.floor(Math.random() * itemArr.length);
    newItems[i] = itemArr[x];
    i += 1;
    itemArr.splice(x, 1);
  }
  return newItems;
}

async function callTourPlace(areaCodes, categoryCodes) {
  // Trip Info
  const service = 'areaBasedList';
  const tripParams = JSON.parse(JSON.stringify(baseParams));
  tripParams.params.listYN = 'Y'; // Y는 목록, N은 개수
  // 대표 이미지가 반드시 있는 정렬 O: 제목순, P: 조회순
  tripParams.params.arrange = 'P';
  tripParams.params.numOfRows = 50;
  tripParams.params.pageNo = 1;
  const promises = [];
  // 아무데나 선택한 경우
  if (areaCodes.length === 0) {
    // 전체 선택한 경우
    if (categoryCodes.length === 0) {
      promises.push(callService(service, tripParams));
    } else { // category 있는 경우
      for (const categoryCode of categoryCodes) {
        const tempParams = JSON.parse(JSON.stringify(tripParams));
        addCategoryParams(tempParams, categoryCode);
        promises.push(callService(service, tempParams));
      }
    }
  } else { // area 선택한 경우
    // 전체 선택한 경우
    if (categoryCodes.length === 0) {
      for (const areaCode of areaCodes) {
        const tempParams = JSON.parse(JSON.stringify(tripParams));
        tempParams.params.areaCode = areaCode;
        promises.push(callService(service, tempParams));
      }
    } else { // category 있는 경우
      for (const areaCode of areaCodes) {
        const tempParams = JSON.parse(JSON.stringify(tripParams));
        tempParams.params.areaCode = areaCode;
        for (const categoryCode of categoryCodes) {
          const tempParamsVersion2 = JSON.parse(JSON.stringify(tempParams));
          addCategoryParams(tempParamsVersion2, categoryCode);
          promises.push(callService(service, tempParamsVersion2));
        }
      }
    }
  }
  return (await Promise.all(promises));
}

async function getTotalPlace(userId) {
  try {
    const totalResult = await getTotalTest(userId);
    // Call Service 를 하기 전 total Result 에서 code 뽑아 내기.
    let areaCodes = []; // 아무데나 인 경우 빌 예정
    const categoryCodes = []; // 전체 일 경우 빌 예정
    if (!totalResult.area.includes(0)) {
      for (const areaInfo of totalResult.area) {
        areaCodes.push(areaInfo.area_code);
      }
    }
    if (!totalResult.category.includes(0)) {
      for (const categoryInfo of totalResult.category) {
        const categoryObject = {};
        const code = categoryInfo.category_code;
        if (code.length > 5) { // cat3 인 경우
          categoryObject.cat1 = code.substr(0, 3);
          categoryObject.cat2 = code.substr(0, 5);
          categoryObject.cat3 = code;
        } else if (code.length <= 5 && code.length > 3) { // cat2 인 경우
          categoryObject.cat1 = code.substr(0, 3);
          categoryObject.cat2 = code;
        } else { // cat1인 경우
          categoryObject.cat1 = code;
        }
        categoryCodes.push(categoryObject);
      }
    }
    const tripResult = {};
    let promiseResult;
    tripResult.totalCount = 0;
    tripResult.items = [];
    promiseResult = await callTourPlace(areaCodes, categoryCodes);
    for (const result of promiseResult) {
      if (result.numOfRows >= result.totalCount) {
        tripResult.totalCount += result.totalCount;
      } else {
        tripResult.totalCount += result.numOfRows;
      }
    }
    // 아무런 결과가 나오지 않을 때 - 맞는 게 없는 거임: 지역으로 추천
    if (tripResult.totalCount === 0) {
      areaCodes = [];
      promiseResult = await callTourPlace(areaCodes, categoryCodes);
    }
    for (const result of promiseResult) {
      if (result.numOfRows >= result.totalCount) {
        tripResult.totalCount += result.totalCount;
      } else {
        tripResult.totalCount += result.numOfRows;
      }
      itemsToResult(result, tripResult);
    }
    tripResult.items = mixResult(tripResult.items);
    return tripResult;
  } catch (err) {
    console.error('getTotalPlace() error');
    console.error(err.message);
    throw err;
  }
}

// sortOption: 0-count 1-heart 2-title
async function getMyPlace(userInfo, sortOption = 0) {
  try {
    let userTripResult;
    const userId = userInfo.id;
    // 테스트 아직 안했을 경우
    if (!userInfo.testIdx) {
      return null;
    }
    if (userInfo.userPlaces === null) {
      userTripResult = await getTotalPlace(userId);
      await models.users.update({
        userPlaces: userTripResult,
      }, {
        where: {
          id: userId,
        },
      });
    } else {
      userTripResult = userInfo.userPlaces;
    }
    await checkPlaceInfo(userInfo, userTripResult);
    sortItems(sortOption, userTripResult);
    if (userTripResult.items.length > 100) {
      userTripResult.items = userTripResult.items.filter((item, idx) => idx < 100);
    }
    return userTripResult;
  } catch (err) {
    console.error('getMyPlace() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  getMyPlace,
};
