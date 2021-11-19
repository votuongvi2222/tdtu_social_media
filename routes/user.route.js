var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role'),
    userControllers = require('../controllers/user.controller'),
    {ensureAuth, ensureGuest} = require('../middlewares/checkAccountAuth.middleware')
/* GET home page. */
router.get('/', ensureAuth, userControllers.loadHomePage);
router.get('/login', ensureGuest, userControllers.loadLoginPage);
router.get('/add', ensureAuth, userControllers.loadPostFormPage);
router.get('/about', ensureAuth, userControllers.loadAboutPage);
router.get('/noti', ensureAuth, userControllers.loadNotiPagePerDep);
var departments = {
  '0': 'Khoa Ngoại ngữ',
  '1': 'Khoa Mỹ thuật công nghiệp',
  '2': 'Khoa Kế toán',
  '3': 'Khoa Khoa học xã hội và Nhân văn',
  '4': 'Khoa Điện - Điện tử',
  '5': 'Khoa Công nghệ thông tin',
  '6': 'Khoa Khoa học ứng dụng',
  '7': 'Khoa Quản trị kinh doanh',
  '8': 'Khoa Kỹ thuật công trình',
  '9': 'Khoa Môi trường và Bảo hộ lao động',
  'A': 'Khoa Lao động công đoàn',
  'B': 'Khoa Tài chính - Ngân hàng',
  'C': 'Khoa Toán - Thống kê',
  'D': 'Khoa Khoa học thể thao',
  'E': 'Khoa Luật',
  'H': 'Khoa Dược',
  'G': 'Phòng Công tác học sinh sinh viên',
  'K': 'Phòng Đại học',
  'M': 'Phòng Sau đại học',
  'N': 'Phòng Điện toán và máy tính',
  'P': 'Phòng khảo thí và kiểm định chất lượng',
  'J': 'Phòng Tài chính',
  'O': 'TDT Creative Language Center',
  'I': 'Trung tâm tin học',
  'L': 'Trung tâm đào tạo và phát triển xã hội',
  'R': 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ',
  'Q': 'Trung tâm hợp tác doanh nghiệp và cựa sinh viên',
  'W': 'Trung tâm ngoại ngữ - tin học - bồi dưỡng văn hóa',
  'X': 'Viện chính sách kinh tế và kinh doanh',
  'Y': 'Khoa giáo dục quốc tế'
}
router.get('/init', (req, res) => {
  new Role({
    name: 'student',
    roleCode: 1
  }).save()
  new Role({
    name: 'department',
    roleCode: 2
  }).save()
  new Role({
    name: 'admin',
    roleCode: 3
  }).save()
  Object.keys(departments)
  .forEach(function eachKey(code) { 
    console.log('code: ' + code)
    console.log('name: ' + departments[code])
    departmentAccount = new Account({
      username: code+randomstring.generate(6),
      hashedPassword: bcrypt.hashSync(code+randomstring.generate(6), 10),
      roleId: 2
    })
    departmentAccount.save((err, acc) => {
      // if(err) return res.send(500, 'db account err')
      new Department({
        name: departments[code],
        departmentCode: code,
        accountId: [acc._id],
        responsibilities: [code]
      }).save((err, dep) => {
        // if(err) return res.send(500, 'db department err')
        console.log(dep)
      })
    })
  });
  res.send('ok')
})

module.exports = router;
