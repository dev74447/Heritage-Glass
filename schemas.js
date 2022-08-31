const joi= require('joi')

module.exports.campgroundSchema= joi.object({
    campground: joi.object({
        title: joi.string().required(),
        location: joi.string().required(),
        img: joi.string().required(),
        description: joi.string().required(),
        Country: joi.string().required(),
        Region: joi.string().required(),
        date_inscribed:joi.string().required(),
        category: joi.string().required(),
        category_code:joi.string().required(),
        iso_code: joi.string().required(),
        area: joi.number().required().min(0),
        danger: joi.number().required().min(0),
    }).required()
});