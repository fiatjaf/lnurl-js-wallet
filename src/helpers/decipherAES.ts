/** @format */

import aesjs from 'aes-js'
import Base64 from 'base64-js'
import {LNURLPaySuccessAction} from '../types'

export function decipherAES(
  sa: LNURLPaySuccessAction,
  preimage: string
): string {
  if (sa.tag !== 'aes') {
    return ''
  }

  let key = aesjs.utils.hex.toBytes(preimage)
  let iv = Base64.toByteArray(sa.iv as string)
  let ciphertext = Base64.toByteArray(sa.ciphertext as string)

  let CBC = new aesjs.ModeOfOperation.cbc(key, iv)
  var plaintext = CBC.decrypt(ciphertext)

  // remove padding
  let size = plaintext.length
  let pad = plaintext[size - 1]
  plaintext = plaintext.slice(0, size - pad)

  return aesjs.utils.utf8.fromBytes(plaintext)
}
