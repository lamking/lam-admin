import JSEncrypt from 'jsencrypt'
const RSA_PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3tv94ertpW1LejYc1KCmCr+xWh3W58DjlzZi4LlTczk38hq/31618GevmDzXOgH8SZcKIQsQ7plPeK4dV2PXQUKpmXV5NHwn2qhB0EtnPDhRLSdh4c0RWbUorEM+Og2BncP2KLCoHS1nyuKwtBltfRHGhQ1/siZ0h00V8vzpo+QIDAQAB'
const RSA = new JSEncrypt()
RSA.setPublicKey(RSA_PUBLIC_KEY)
function install (Vue) {
  Vue.prototype.$rsa = (text) => {
    return RSA.encrypt(text)
  }
}

export default install
