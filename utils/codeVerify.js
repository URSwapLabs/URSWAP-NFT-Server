const crypto = require("crypto");

function generateCodeVerifier() {
    return crypto.randomBytes(32).toString("hex");
}

function generateCodeChallenge(codeVerifier) {
    return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

module.exports = {
    codeVerifier,
    codeChallenge
}