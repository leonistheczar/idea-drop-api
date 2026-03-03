import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
        trim: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true, 
        trim: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    }
}, { timestamps: true, });
// Hashing password before saving
userSchema.pre('save', async function() {
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
// Matches the pass with the hashed pass during login
userSchema.methods.matchPass = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
const User = mongoose.model("User", userSchema);
export default User