import mongoose, { Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        vault: {
            type: [Schema.Types.Mixed],
            default: []
        }
    }, 
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema);

export default User;
