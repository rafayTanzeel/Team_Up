
const registerValidationSchema = {
  'email': {
    notEmpty: true,
    isEmail: {
      errorMessage: 'Invalid Email',
    },
  },
  'password': {
    notEmpty: true,
    matches: {
      options: ['example', 'i'],
    },
    errorMessage: 'Invalid Password',
  },
  'confirmPassword': {
    notEmpty: true,
    equals: 'password',
    matches: {
      options: ['example', 'i'],
    },
    errorMessage: 'Invalid Password',
  },
  'fname': {
    isLength: {
      options: [{
        min: 2,
        max: 20,
      }],
      errorMessage: 'Must be between 2 and 10 chars long',
    },
    isAlpha: {
      errorMessage: 'Must have only alphabets',
    },
    errorMessage: 'Invalid First Name',
  },
  'lname': {
    isLength: {
      options: [{
        min: 2,
        max: 20,
      }],
      errorMessage: 'Must be between 2 and 10 chars long',
    },
    isAlpha: {
      errorMessage: 'Must have only alphabets',
    },
    errorMessage: 'Invalid Last Name',
  },
};

module.exports = registerValidationSchema;
