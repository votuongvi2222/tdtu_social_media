var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role'),
    userControllers = require('../controllers/user.controller'),
    {ensureAuth, ensureGuest} = require('../middlewares/checkAccountAuth.middleware')

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

router.get('/init', async (req, res) => {
  Object.keys(departments)
  .forEach(async function eachKey(code) { 
    console.log('code: ' + code)
    console.log('name: ' + departments[code])
    var username = code+randomstring.generate(6)
    const departmentAccount = new Account({
      username: username,
      hashedPassword: bcrypt.hashSync(username, 10),
      avatar: "images/avatar.png",
      roleId: 2
    })
    await departmentAccount.save()
    const department = new Department({
        name: departments[code],
        departmentCode: code,
        accountId: departmentAccount._id,
        responsibilities: code
    })
    await department.save();

    console.log(department)
  });
  res.send('ok')

})
    
//  @desc Load home page
//  @route GET /
router.get('/', ensureAuth, userControllers.loadHomePage);


router.get('/dashboard', ensureAuth, userControllers.loadDashboardPage);
router.post('/dashboard', userControllers.setRole);


//  @desc Load login page
//  @route GET /login
router.get('/login', ensureGuest, userControllers.loadLoginPage);

//  @desc Load login page
//  @route GET /login
router.post('/login', userControllers.login);



//  @desc Load form to add new notice
//  @route GET /add
router.get('/add', ensureAuth, userControllers.loadPostFormPage);

//  @desc Load instruction page
//  @route GET /about
router.get('/about', ensureAuth, userControllers.loadAboutPage);

//  @desc Load notification page (all noti)
//  @route GET /noti
router.get('/noti', ensureAuth, userControllers.loadAllNotiPage);

//  @desc Load notification page per dep
//  @route GET /noti
router.get('/notiper', ensureAuth, userControllers.loadNotiPagePerDep);

// router.post('/addNoti', ensureAuth, userControllers.addNoti);

router.get('/notidetail', ensureAuth, userControllers.loadNotiDetail);


//  @desc Load notification page (all noti)
//  @route GET /noti
router.get('/:id', ensureAuth, userControllers.loadPersonalPageById);


module.exports = router;
