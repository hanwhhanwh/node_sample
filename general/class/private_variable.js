/**
 * @brief private 변수에 대한 type hint 설정 방법
 * @date 2024-03-21
 * @author hbesthee@naver.com
 */

class MyClass {
	/** no type hint Image object */
	#imageNoHint = null;
	/** @type {Image} has type hint Image object */
	#imageHasHint = null;

	constructor() {
		super();

		this.#imageNoHint = new Image(100, 100);
		this.#imageHasHint = new Image(100, 100);
	}
}


const my = new MyClass();
