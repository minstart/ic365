import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

// console.log("JSEncrypt:::",JSEncrypt)
// console.log("CryptoJS:::",CryptoJS)
// RSA加密
export function rsaEncrypt(data, publicKey) {
	const encryptor = new JSEncrypt()
	encryptor.setPublicKey(publicKey)
	return encryptor.encrypt(data)
}

export function aesEncrypt(data, key) {
	// console.log(CryptoJS)
	// console.log(CryptoJS.enc)
	// console.log(CryptoJS.enc.Base64)
	// console.log(key)
	// 将Base64密钥转换为WordArray
	const keyWA = CryptoJS.enc.Base64.parse(key)
	const iv = CryptoJS.lib.WordArray.random(16)

	const encrypted = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		keyWA, // 使用解析后的密钥
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}
	)

	const combined = iv.concat(encrypted.ciphertext)
	return combined.toString(CryptoJS.enc.Base64)
}

export function aesDecrypt(ciphertext, key) {
	const keyWA = CryptoJS.enc.Base64.parse(key)

	const rawData = CryptoJS.enc.Base64.parse(ciphertext)
	const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4), 16)
	const ciphertextWA = CryptoJS.lib.WordArray.create(
		rawData.words.slice(4),
		rawData.sigBytes - 16
	)

	const decrypted = CryptoJS.AES.decrypt({
			ciphertext: ciphertextWA
		},
		keyWA, // 使用解析后的密钥
		{
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}
	)

	return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
}

export function generateAesKey() {
	return CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(32))
}