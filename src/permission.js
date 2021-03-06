import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      const userType = store.getters.userType
      // if is logged in, redirect to the home page
      if (userType === 0) {
        next({ path: '/console' })
      } else if (userType === 1) {
        next({ path: '/platform' })
      } else if (userType === 2) {
        next({ path: '/my' })
      } else {
        next({ path: '/' })
      }
      NProgress.done()
    } else {
      const userType = store.getters.userType
      if (userType !== '') {
        if (to.path === '/') {
          if (userType === 0) {
            next({ path: '/console' })
          } else if (userType === 1) {
            next({ path: '/platform' })
          } else if (userType === 2) {
            next({ path: '/my' })
          }
          NProgress.done()
        }
        next()
        NProgress.done()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { uris, userType } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', uris)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })
          // if (userType === 0) {
          //   next({ path: '/console', replace: true })
          // }
          if (to.path === '/') {
            if (userType === 0) {
              next({ path: '/console' })
            } else if (userType === 1) {
              next({ path: '/platform' })
            } else if (userType === 2) {
              next({ path: '/my' })
            }
          } else {
            next({ ...to, replace: true })
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
