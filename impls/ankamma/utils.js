const areArraysEqual = function (array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let index = 0; index < array1.length; index++) {
    if (!areEqual(array1[index], array2[index])) {
      return false;
    }
  }
  return true;
};

const areEqual = function (element1, element2) {
  if (typeof element1 == "number" && typeof element2 == "number") {
    return element1 === element2;
  }
  if (Array.isArray(element1.value) && Array.isArray(element2.value)) {
    return areArraysEqual(element1.value, element2.value);
  }

  return element1.value === element2.value;
};

module.exports = { areEqual };
