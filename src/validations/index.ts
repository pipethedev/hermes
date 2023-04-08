import Schema from 'validate'

export const connectionValidation = new Schema({
    host: {
        type: String,
        required: true,
        length: { min: 1, max: 255 }
    },
    port: {
        type: Number,
        required: true,
        length: { min: 1, max: 5 }
    }
});