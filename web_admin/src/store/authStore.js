import create from 'zustand'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  checkAuth: () => {
    const token = localStorage.getItem('token')
    if (token) {
      set({ token, isLoggedIn: true })
    }
  },

  login: async (phone, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        phone,
        password,
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({ token, user, isLoggedIn: true })
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({ token: null, user: null, isLoggedIn: false })
  },
}))
