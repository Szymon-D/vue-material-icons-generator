module.exports = (snakeCase) => snakeCase.substring(0, 1).toUpperCase() +
    snakeCase.substring(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
