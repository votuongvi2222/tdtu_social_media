
module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('==================auth===========================')
      return next();
    } else {
      console.log('==================guest===========================')
      return res.redirect('/login')
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('2==================auth===========================')
      return res.redirect('/')
    } else {
      console.log('2==================guest===========================')
      return next()
    }
  }
}