const Constants = {
    TRUE: 1,
    FALSE: 0,

    //error status
    STATUS_CODE_SUCCESS: 200,
    STATUS_CODE_BAD_REQUEST: 400,
    STATUS_CODE_UNAUTHORIZED: 401,
    STATUS_CODE_NOT_FOUND: 404,
    STATUS_CODE_ERROR: 500,

    //custom error status
    TOKEN_INVALID: 'token_invalid',
    TOKEN_EXPIRED: 'token_expired',
    TOKEN_BLACKLISTED: 'token_blacklisted',
    TOKEN_NOT_FOUND: 'token_not_found',
}

export default Constants;