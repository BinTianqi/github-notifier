export default async function verifySignature(secret, signature, payload) {
    const encoder = new TextEncoder()
    const algorithm = { name: "HMAC", hash: { name: 'SHA-256' } }
    const keyBytes = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        false,
        [ "sign", "verify" ],
    )
    const sigHex = signature.split("=")[1]
    const sigBytes = hexToBytes(sigHex)
    const dataBytes = encoder.encode(payload)
    const equal = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    )
    return equal
}

function hexToBytes(hex) {
    let len = hex.length / 2
    let bytes = new Uint8Array(len)
    let index = 0
    for (let i = 0; i < hex.length; i += 2) {
        let c = hex.slice(i, i + 2)
        let b = parseInt(c, 16)
        bytes[index] = b
        index += 1
    }
    return bytes
}

