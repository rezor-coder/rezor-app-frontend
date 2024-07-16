// Validate password complexity
export const validatePassword = password => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Validate if input is a number
export const numberValidation = number => {
  const regex = /^\d+$/;
  return regex.test(number);
};

// Validate if two passwords match
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Validate email format
export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate OTP (6 digits)
export const validateOTP = otp => {
  const regex = /^\d{6}$/;
  return regex.test(otp);
};
export const zipCodeValidation = zipCode => {
  const regex = /^[0-9]{5,10}$/;
  return regex.test(zipCode);
};
export const stringValidation = string => {
  const regex = /^[a-zA-Z\s]{1,100}$/;
  return regex.test(string);
};
