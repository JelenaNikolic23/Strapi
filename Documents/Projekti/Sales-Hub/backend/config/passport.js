const JwtStrategy = require("passport-jwt").Strategy;
const ExtractToken = require("passport-jwt").ExtractJwt;
const tokenKey = require("./keys").tokenKey;

// Strategy options
const options = {
  jwtFromRequest: ExtractToken.fromAuthHeaderAsBearerToken(),
  secretOrKey: tokenKey
};

// Strategy object
const strategy = new JwtStrategy(options, (payload, done) => {
  if (payload.frontline_id) {
    return done(null, payload);
  }

  return done(null, false);
});

// passport is available from index.js require
module.exports = passport => {
  passport.use(strategy);
};
