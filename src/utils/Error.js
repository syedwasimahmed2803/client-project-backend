const parseMongoError = (error) => {
  // Duplicate key error (MongoDB)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use.`;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    return messages.join(', ');
  }

  // Plain JavaScript Error
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred.';
};

module.exports = parseMongoError;
