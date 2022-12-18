const Products = require('../models/productModel')
const Category = require('../models/categoryModel')
const Users = require('../models/userModel')
const Banner = require('../models/bannerModel')
const Coupon = require('../models/couponModel')
const Admin = require('../models/adminModel')

const itemsPerPage = 1

exports.loadAdminLogin = async (req, res) => {
  try {
    if (req.session.admin) {
      res.redirect('/admin/home')
    } else {
      res.render('admin/login')
    }
  } catch (error) {
    console.log(error.message)
  }
}
exports.verifylogin = async (req, res) => {
  try {
    const adminData = await Admin.findOne({ email: req.body.email })
    if (adminData) {
      if (adminData.password === req.body.password) {
        req.session.admin = adminData._id

        res.redirect('/admin/home')
      }
    } else {
      res.render('admin/login')
    }
  } catch (error) {
    console.log(error.message)
  }
}

exports.loadAdminHome = (req, res) => {
  res.render('admin/home', { path: '/admin/home' })
}

exports.loadAdminUsers = async (req, res) => {
  try {
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }
    console.log(search)
    const page = +req.query.page || 1
    const total = await Users.find().countDocuments()

    const userDAta = await Users.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
    res.render('admin/users', {
      users: userDAta,
      path: '/admin/users',
      totalProducts: total,
      needNextPage: itemsPerPage * page < total,
      needPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      currentPage: page,
      itemsPerPage
    })
  } catch (error) {
    console.log(error.message)
  }
}
exports.blockUser = async (req, res) => {
  try {
    const id = req.query.id
    const page = +req.query.page || 1

    const userData = await Users.findById({ _id: id })
    if (userData.isBlocked) {
      await Users.findByIdAndUpdate(
        { _id: id },
        { $set: { isBlocked: false } }
      )
    } else {
      await Users.findByIdAndUpdate(
        { _id: id },
        { $set: { isBlocked: true } }
      )
    }
    res.redirect('/admin/users/?page=' + page)
  } catch (error) {
    console.log(error.message)
  }
}

exports.loadAdminProducts = async (req, res) => {
  try {
    const products = await Products.find({ status: 1 })

    res.render('admin/products', {
      path: '/admin/products',
      message: 'admin',
      products
    })
  } catch (error) {
    console.log(error.mess)
  }
}

exports.loadAddProducts = async (req, res) => {
  try {
    const category = await Category.find()
    res.render('admin/add-products', {
      path: '/admin/products',
      category,
      message: req.flash('errormessage')
    })
  } catch (error) {
    console.log(error.message)
  }
}
exports.insertProducts = async (req, res) => {
  try {
    const a = req.files

    if (req.files) {
      const products = new Products({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        offer: req.body.offer,
        status: 1,
        brand:req.body.brand,
        
        image: a.map((x) => x.location)
      })

      const newProduct = await products.save()

      if (newProduct) {
        res.redirect('/admin/add-products')
      } else {
        return res.render('add-product.ejs', {
          message: 'something went wrong'
        })
      }
    } else {
      req.flash('errormessage', ' Image field cannot be empty')

      return res.redirect('/admin/add-products')
    }
  } catch (error) {
    console.log(error.message)
  }
}
exports.editProducts = async (req, res) => {
  try {
    const id = req.query.id
    const category = await Category.find()

    const editProduct = await Products.findById({ _id: id })

    res.render('admin/edit-products', {
      product: editProduct,
      category,
      path: '/admin/products'
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.updateProducts = async (req, res) => {
  try {
    const title = req.body.title
    const category = req.body.category
    const price = req.body.price
    const description = req.body.description
    const stock = req.body.stock
    const offer = req.body.offer
   
    if (req.files) {
      const a = req.files
      const image = a.map((x) => x.location)
      await Products.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            title,
            image,
            category,
            description,
            stock,
            price,
            offer,
           
          }
        }
      )
    } else {
      const newProduct = await Products.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            title,
            category,
            description,
            stock,
            price,
            offer
          }
        }
      )
      console.log(newProduct)
    }
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error.message)
  }
}

exports.deleteProducts = async (req, res) => {
  try {
    await Products.findByIdAndUpdate({ _id: req.query.id }, { $set: { status: 0 } })
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error.message)
  }
}

exports.loadAdminCoupons = async (req, res) => {
  try {
    const date = new Date()
      .toJSON()
      .slice(0, 10)
      .split('-')
      .reverse()
      .join('/')
    await Coupon.updateMany({ date: { $lte: date } }, { $set: { status: 0 } })

    const coupons = await Coupon.find()
    res.render('admin/coupons', {
      path: '/admin/coupons',
      coupons
    })
  } catch (error) {
    console.log(error.message)
  }
}
exports.loadAddCoupons = async (req, res) => {
  try {
    res.render('admin/add-coupons', { path: '/admin/coupons' })
  } catch (error) {
    console.log(error.message)
  }
}
exports.insertCoupons = async (req, res) => {
  try {
    const date = req.body.date

    const newCoupon = new Coupon({
      code: req.body.code,
      value: req.body.value,
      minbill: req.body.minbill,
      date: changedateformat(date),
      name: req.body.name
    })
    const couponData = await newCoupon.save()
    if (couponData) {
      res.redirect('/admin/coupons')
    }
  } catch (error) {
    console.log(error.message)
  }
}

exports.activateCoupons = async (req, res) => {
  try {
    const id = req.query.id
    const couponData = await Coupon.findOne({ _id: id })
    console.log(couponData)
    if (couponData.status === 1) {
      await Coupon.findByIdAndUpdate(
        { _id: id },
        { $set: { status: 0 } }
      )
      return res.redirect('/admin/coupons')
    } else {
      await Coupon.findByIdAndUpdate(
        { _id: id },
        { $set: { status: 1 } }
      )
      return res.redirect('/admin/coupons')
    }
  } catch (error) {
    console.log(error.message)
  }
}
exports.loadAdminCategory = async (req, res) => {
  try {
    const category = await Category.find()
    res.render('admin/category', {
      path: '/admin/category',
      categories: category,
      message: req.flash('message')
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.insertCategory = async (req, res) => {
  try {
    const newCategory = req.body.category

    const alreadyExist = await Category.findOne({
      categoryName: newCategory
    })

    if (alreadyExist) {
      req.flash('message', 'Category already exist')

      return res.redirect('/admin/category')
    } else {
      const category = new Category({
        categoryName: newCategory
      })

      const categoryData = await category.save()

      if (categoryData) {
        res.redirect('/admin/category')
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.query.id

    await Category.deleteOne({ _id: id })
    res.redirect('/admin/category')
  } catch (error) {
    console.log(error.message)
  }
}
exports.loadAdminOrders = (req, res) => {
  res.render('admin/orders', { path: '/admin/orders' })
}
exports.loadAdminBanners = async (req, res) => {
  try {
    const banner = await Banner.find()
    console.log(banner);
    res.render('admin/banners', {
      path: '/admin/banners',
      banners: banner
    })
  } catch (error) {
    console.log(error.message)
  }
}
exports.addBanner = async (req, res) => {
  try {
    const newBanner = req.body.bannername
    const a = req.files

    const banner = new Banner({
      banner: newBanner,
      banerimage:a.map((x) => x.location)
      
    })

    const bannerData = await banner.save()

    if (bannerData) {
      res.redirect('/admin/banners')
    }
  } catch (error) {
    console.log(error.message)
  }
}
exports.currentBanner = async (req, res) => {
  try {
    const id = req.query.id
    await Banner.findOneAndUpdate({isActive:1},{$set:{isActive:0}})

    await Banner.findByIdAndUpdate({ _id: id },{$set:{isActive:1}})
    res.redirect('/admin/banners')
  } catch (error) {
    console.log(error.message)
  }
}
function changedateformat (val) {
  const myArray = val.split('-')

  const year = myArray[0]
  const month = myArray[1]
  const day = myArray[2]

  const formatteddate = day + '/' + month + '/' + year
  return formatteddate
}
exports.logout = async (req, res) => {
  try {
    req.session.admin = null
    return res.redirect('/admin')
  } catch (error) {
    console.log(error.message)
  }
}
