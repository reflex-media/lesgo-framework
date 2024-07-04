export default {
  secret: 'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
  iss: {
    validate: true,
    data: ['domain.com'],
  },
  customClaims: {
    validate: true,
    data: ['department_id'],
  },
};
