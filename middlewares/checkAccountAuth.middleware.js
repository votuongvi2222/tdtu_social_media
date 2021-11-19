
module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('==================auth===========================')
      return next();
    } else {
      if(req.session.isAuth){
        return next()
      }
      console.log('==================guest===========================')
      return res.redirect('/login')
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('2==================auth===========================')
      return res.redirect('/')
    } else {
      if(req.session.isAuth){
        return res.redirect('/')
      }
      console.log('2==================guest===========================')
      return next()
    }
  }
}