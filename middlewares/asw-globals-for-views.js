module.exports = (request, response, next) => {
    global.SESSION = request.session;
    next();
}
