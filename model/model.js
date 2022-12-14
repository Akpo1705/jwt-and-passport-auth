const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
        email: {type: String, requiered: true, unique: true},
        password: {type: String, require: true}
});


UserSchema.pre('save', async function(next){
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
})

UserSchema.methods.isValidPassword = async function(password){
        const user = this; 
        const compare = await bcrypt.compare(password, user.password);
        return compare;
}

module.exports = model('User', UserSchema);