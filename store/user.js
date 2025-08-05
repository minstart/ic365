import { login, logout, getInfo, getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {

  // 从 Cookies 恢复密钥
  const crypto = JSON.parse(Cookies.get('crypto') || 'null') || {
    sessionKey: '',
    aesKey: '',
    expireTime: 0
  };

  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    menus: [],
    crypto: crypto,
    encrypt_enabled: process.env.VUE_APP_ENCRYPT_ENABLED === 'true'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Cookies.remove('crypto')
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_CRYPTO: (state, crypto) => {
    state.crypto = crypto
    Cookies.set('crypto', JSON.stringify(crypto))
  },
  SET_ENCRYPTENABLED: (state, encryptEnabled) => {
    state.encryptEnabled = encryptEnabled
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  getMenuFromServer({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu().then(response => {
        const menus = response.data
        commit('SET_MENUS', menus)
        resolve(menus)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
