const passport = require("passport");
const local = require("./localStrategy");
const Members = require("../models/members");

module.exports = () => {
  passport.serializeUser((member, done) => {
    done(null, member.id);
  });

  passport.deserializeUser((id, done) => {
    Members.findById(id)
      .then((member) => {
        done(null, member);
      })
      .catch((err) => done(err));
  });

  local();
};
