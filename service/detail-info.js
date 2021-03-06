const {
  callService, baseParams, models, checkBasket,
} = require('./init-module');

function makeIntroInfo(contentTypeId, introInfo) {
  const result = {};
  const useInfo = {};
  const facilityInfo = {};
  // 키 값이 총 8가지 (이용안내 - 문의 및 안내, 이용시간, 쉬는날, 이용요금, 관람 소요 / 편의시설)
  switch (contentTypeId) {
    case 12:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenter || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.usetime || '정보 없음',
      };
      useInfo.key3 = {
        key: '이용 시기',
        value: introInfo.useseason || '정보 없음',
      };
      useInfo.key4 = {
        key: '쉬는 날',
        value: introInfo.restdate || '정보 없음',
      };
      useInfo.key5 = {
        key: '수용 인원',
        value: introInfo.accomcount || '정보 없음',
      };
      facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriage || '정보 없음'}`;
      facilityInfo.key2 = `애완동물 ${introInfo.chkpet || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parking || '정보 없음'}`;
      break;
    case 14:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenterculture || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.usetimeculture || '정보 없음',
      };
      useInfo.key3 = {
        key: '쉬는 날',
        value: introInfo.restdateculture || '정보 없음',
      };
      useInfo.key4 = {
        key: '이용 요금',
        value: introInfo.usefee || '정보 없음',
      };
      useInfo.key5 = {
        key: '관람 소요 시간',
        value: introInfo.spendtime || '정보 없음',
      };
      facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageculture || '정보 없음'}`;
      facilityInfo.key2 = `애완동물 ${introInfo.chkpetculture || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parkingculture || '정보 없음'}`;
      break;
    case 15:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.eventhomepage || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.playtime || '정보 없음',
      };
      useInfo.key3 = {
        key: '이용 요금',
        value: introInfo.usefeefestival || '정보 없음',
      };
      useInfo.key4 = {
        key: '행사 시작일',
        value: introInfo.eventstartdate || '정보 없음',
      };
      useInfo.key5 = {
        key: '행사 종료일',
        value: introInfo.eventenddate || '정보 없음',
      };
      facilityInfo.key1 = `예매처 ${introInfo.bookingplace || '정보 없음'}`;
      facilityInfo.key2 = `할인 ${introInfo.discountinfofestival || '정보 없음'}`;
      facilityInfo.key3 = '';
      break;
    case 28:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenterleports || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.usetimeleports || '정보 없음',
      };
      useInfo.key3 = {
        key: '쉬는 날',
        value: introInfo.restdateleports || '정보 없음',
      };
      useInfo.key4 = {
        key: '이용 요금',
        value: introInfo.usefeeleports || '정보 없음',
      };
      useInfo.key5 = {
        key: '예약 안내',
        value: introInfo.reservation || '정보 없음',
      };
      facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageleports || '정보 없음'}`;
      facilityInfo.key2 = `애완동물 ${introInfo.chkpetleports || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parkingleports || '정보 없음'}`;
      break;
    case 32:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenterlodging || '정보 없음',
      };
      useInfo.key2 = {
        key: '입실 시간',
        value: introInfo.checkintime || '정보 없음',
      };
      useInfo.key3 = {
        key: '퇴실 시간',
        value: introInfo.checkouttime || '정보 없음',
      };
      useInfo.key4 = {
        key: '수용 가능 인원',
        value: introInfo.accomcountlodging || '정보 없음',
      };
      useInfo.key5 = {
        key: '예약 안내',
        value: introInfo.reservationurl || '정보 없음',
      };
      facilityInfo.key1 = `바베큐 ${introInfo.barbecue || '정보 없음'}`;
      facilityInfo.key2 = `객실 내 취사 ${introInfo.chkcooking || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parkinglodging || '정보 없음'}`;
      break;
    case 38:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocentershopping || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.opentime || '정보 없음',
      };
      useInfo.key3 = {
        key: '쉬는 날',
        value: introInfo.restdateshopping || '정보 없음',
      };
      useInfo.key4 = {
        key: '매장 안내',
        value: introInfo.shopguide || '정보 없음',
      };
      useInfo.key5 = {
        key: '바로 가기',
        value: introInfo.culturecenter || '정보 없음',
      };
      facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriageshopping || '정보 없음'}`;
      facilityInfo.key2 = `애완동물 ${introInfo.chkpetshopping || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parkingshopping || '정보 없음'}`;
      break;
    case 39:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenterfood || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.opentimefood || '정보 없음',
      };
      useInfo.key3 = {
        key: '쉬는 날',
        value: introInfo.restdatefood || '정보 없음',
      };
      useInfo.key4 = {
        key: '포장',
        value: introInfo.packing || '정보 없음',
      };
      useInfo.key5 = {
        key: '좌석 수',
        value: introInfo.seat || '정보 없음',
      };
      facilityInfo.key1 = `어린이 놀이방 ${introInfo.kidsfacility || '정보 없음'}`;
      facilityInfo.key2 = `신용카드 ${introInfo.chkcreditcardfood || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parkingfood || '정보 없음'}`;
      break;
    default:
      useInfo.key1 = {
        key: '문의 및 안내',
        value: introInfo.infocenter || '정보 없음',
      };
      useInfo.key2 = {
        key: '이용 시간',
        value: introInfo.usetime || '정보 없음',
      };
      useInfo.key3 = {
        key: '이용 시기',
        value: introInfo.useseason || '정보 없음',
      };
      useInfo.key4 = {
        key: '쉬는 날',
        value: introInfo.restdate || '정보 없음',
      };
      useInfo.key5 = {
        key: '수용 인원',
        value: introInfo.accomcount || '정보 없음',
      };
      facilityInfo.key1 = `유모차 대여 ${introInfo.chkbabycarriage || '정보 없음'}`;
      facilityInfo.key2 = `애완동물 ${introInfo.chkpet || '정보 없음'}`;
      facilityInfo.key3 = `주차 ${introInfo.parking || '정보 없음'}`;
      break;
  }
  result.use = useInfo;
  result.facility = facilityInfo;
  return result;
}

// 세부 정보 조회 페이지에서 호출, 세부 정보 조회 시 조회 수 올라가고 최근 조회한 여행지에 추가.
async function getCommonInfo(userInfo, contentId, contentTypeId) {
  const result = {};
  const tx = await models.sequelize.transaction();
  try {
    let sqlResult;
    const promises = [];
    const contentParams = JSON.parse(JSON.stringify(baseParams));
    contentParams.params.numOfRows = 1;
    contentParams.params.contentId = contentId;
    contentParams.params.contentTypeId = contentTypeId;
    promises.push(callService('detailIntro', contentParams));
    const commonParams = JSON.parse(JSON.stringify(contentParams));
    commonParams.params.defaultYN = 'Y';
    commonParams.params.firstImageYN = 'Y';
    commonParams.params.addrinfoYN = 'Y';
    commonParams.params.areacodeYN = 'Y';
    commonParams.params.mapinfoYN = 'Y';
    commonParams.params.overviewYN = 'Y';
    promises.push(callService('detailCommon', commonParams));
    const commonResult = await Promise.all(promises);
    for (const resultItem of commonResult) {
      const info = resultItem.items.item;
      if (info.hasOwnProperty('addr1')) { // Common
        const commonInfo = {};
        sqlResult = await models.tourArea.findOne({
          where: {
            areaCode: info.areacode,
            sigunguCode: info.sigungucode || null,
          },
          attributes: ['area_name', 'sigungu_name'],
        });
        if (sqlResult) {
          const areaInfo = sqlResult.get();
          commonInfo.area = `${areaInfo.area_name} ${areaInfo.sigungu_name || ''}`;
        }
        commonInfo.title = info.title;
        commonInfo.address = info.addr1;
        commonInfo.heart = false;
        if (userInfo) {
          commonInfo.heart = await checkBasket(userInfo, info.contentid);
        }
        commonInfo.introStr = info.overview;
        commonInfo.areaCode = info.areacode;
        commonInfo.sigunguCode = info.sigungucode;
        commonInfo.mapx = info.mapx;
        commonInfo.mapy = info.mapy;
        commonInfo.homepage = info.homepage;
        commonInfo.firstimage = info.firstimage;
        result.common = commonInfo;
      } else { // Intro
        result.intro = makeIntroInfo(contentTypeId, info);
      }
    }
    if (userInfo) { // user search place 가져오기 (로그인 되어 있는 상태)
      // searchPlace도 마찬가지로 searchItems: [contentId ] 들어갈 예정
      const userId = userInfo.id;
      const userSearch = userInfo.searchPlaces;
      const newItems = [];
      if (userSearch && userSearch.searchItems) { // 기존 정보 있을 때
        for (const searchId of userSearch.searchItems) {
          if (searchId !== contentId) {
            newItems.push(searchId);
          }
        }
        const newLength = newItems.unshift(contentId);
        if (newLength > 30) {
          newItems.pop();
        }
      } else { // 기존 정보 없을 때
        newItems.push(contentId);
      }
      await models.users.update({
        searchPlaces: { searchItems: newItems },
      }, {
        where: { id: userId },
        transaction: tx,
      });
    }
    // place count 업데이트
    sqlResult = await models.places.findOrCreate({
      where: {
        contentID: contentId,
      },
      transaction: tx,
      defaults: {
        contentID: contentId,
        contentTypeID: contentTypeId,
        placeTitle: result.common.title,
        address: result.common.address,
        image: result.common.firstimage || null,
        placeCount: 1,
        placeHeart: 0,
      },
    });
    const placeInfo = sqlResult[0];
    const created = sqlResult[1];
    // 이미 create 된 거면
    if (!created) {
      await models.places.update({
        placeCount: (placeInfo.get()).placeCount + 1,
      }, {
        where: { contentID: contentId },
        transaction: tx,
      });
    }
    await tx.commit();
  } catch (err) {
    if (tx) {
      await tx.rollback();
    }
    console.error('getCommonInfo() error');
    console.error(err.message);
    throw err;
  }
  return result;
}

async function postBasket(userInfo, contentId) {
  const tx = await models.sequelize.transaction();
  try {
    const userBasket = userInfo.basketPlaces;
    // 하트를 누르지 않은 상태라면
    const newItems = [];
    if (userBasket && userBasket.basketItems) {
      for (const basketId of userBasket.basketItems) {
        if (basketId !== contentId) {
          newItems.push(basketId);
        }
      }
      const newLength = newItems.unshift(contentId);
      if (newLength > 30) {
        newItems.pop();
      }
    } else { // 정보 없었으면
      newItems.push(contentId);
    }
    // user 조회 업데이트, place count 업데이트
    await models.users.update({
      basketPlaces: { basketItems: newItems },
    }, {
      where: { id: userInfo.id },
      transaction: tx,
    });
    const sqlResult = await models.places.findOne({
      where: {
        contentID: contentId,
      },
    });
    const placeInfo = sqlResult.get();
    await models.places.update({
      placeHeart: placeInfo.placeHeart + 1,
    }, {
      where: { contentID: contentId },
      transaction: tx,
    });
    await tx.commit();
    return 'success';
  } catch (err) {
    if (tx) {
      await tx.rollback();
    }
    console.error('postBasket() error');
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  getCommonInfo,
  postBasket,
};
