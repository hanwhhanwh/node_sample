let a = 1n;
console.log(Number.isNaN(a)); // false
try {
	console.log(isNaN(a)); // TypeError: Cannot convert a BigInt value to a number
}
catch (Exception) {
	console.log('TypeError: Cannot convert a BigInt value to a number');
}

const arr = [2, 4, NaN, 12];
console.log(arr.indexOf(NaN)); // -1
console.log(arr.includes(NaN)); // true

// 다음과 같이 배열에서 NaN의 위치를 찾을 수 있습니다.
console.log(arr.findIndex((n) => Number.isNaN(n))); // 2
