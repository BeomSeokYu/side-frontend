/* eslint-disable no-unused-vars */
class CommonUtils {

  // 공통된 속성을 이용해 두 객체 배열을 합치는 함수
  mergeObjectArrays = (array1, array2, commonAttr1, commonAttr2 = commonAttr1) => {
    const map = new Map();
    array1.forEach(item => map.set(item[commonAttr1], { ...item }));
    array2.forEach(item => {
      if (map.has(item[commonAttr2])) {
        Object.assign(map.get(item[commonAttr2]), item);
      } else {
        map.set(item[commonAttr2], { ...item });
      }
    });
    return Array.from(map.values());
  }

}

export default new CommonUtils();