export enum ERROR {
  CAST_ERROR = 'CastError',
  DUPLICATE_VALUE = 11000,
  JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError'
}

export enum RESPONSE_STATUS_CODE {
  // Common errors

  SUCCESS = 200,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404
}
