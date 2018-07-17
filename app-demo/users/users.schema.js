const Schema =  require('feathers-schema').Schema

module.exports = new Schema({
  email: {type: String, required: true, email:true, unique:true },
  password: { type: String, required: true },
  //l2rPid: {type: String, required: false, unique:false},
  //roles: {type: [String], default: ['user']}
})
