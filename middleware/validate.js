module.exports = (validator) => {
    return async (req, res, next) => {
        const error = await validator(req);
        if(error) return res.status(400).send(error.message);
        next();
    }
}