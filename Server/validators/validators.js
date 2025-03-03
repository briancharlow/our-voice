import Joi from 'joi';

// List of 47 counties in Kenya + "National"
const validLocations = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", 
    "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", 
    "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", 
    "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", 
    "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia", "Turkana", 
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot", "National"
];

// User Signup Validator
export const validateUser = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        location: Joi.string().valid(...validLocations).required(),
    });

    return schema.validate(data);
};

// Poll Creation Validator
export const validatePoll = (data) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        deadline: Joi.string().pattern(/^\d{2}-\d{2}-\d{2}$/).required(), // Must be in dd-mm-yy format
        location: Joi.string().valid(...validLocations).required(),
        description: Joi.string().required()
    });

    return schema.validate(data);
};

// Document Upload Validator
export const validateDocument = (data) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string().required()
    });

    return schema.validate(data);
};
// Issue Creation Validator
export const validateIssue = (data) => {
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        content: Joi.string().required(),
        category: Joi.string().max(100).required(),
        image: Joi.string().allow('', null), // Image URL can be empty
        location: Joi.string().valid(...validLocations).required()
    });

    return schema.validate(data);
};
