module.exports = (validate) => {
    return async (schema) => {
        try {
            await validate(schema);
        }
        catch(ex) {
            return ex;
        }
    }
}