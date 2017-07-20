import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // 암호화

const Schema = mongoose.Schema;

const Account = new Schema({
  username: String,
  password: String,
  created: { type: Date, dafault: Date.now}
});

// generate hash
Account.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
};

// compares the password
Account.methods.validateHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('account', Account); // collection 이름이 복수형으로 설정이됨 -> accounts
