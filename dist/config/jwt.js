Object.defineProperty(exports, '__esModule', { value: true });
exports.default = {
  secret:
    process.env.LESGO_JWT_SECRET ||
    'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
  iss: {
    validate: process.env.LESGO_JWT_ISS_VALIDATE !== 'true' || true,
    data: process.env.LESGO_JWT_ISS_DATA
      ? process.env.LESGO_JWT_ISS_DATA.split(',')
      : ['domain.com'],
  },
  customClaims: {
    validate: process.env.LESGO_JWT_CUSTOMCLAIMS_VALIDATE !== 'true' || true,
    data: process.env.LESGO_JWT_CUSTOMCLAIMS_DATA
      ? process.env.LESGO_JWT_CUSTOMCLAIMS_DATA.split(',')
      : ['department_id'],
  },
};
