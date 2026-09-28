import React from 'react'
import { GET_USER, LOGIN_USER } from './api'
import { useNavigate } from 'react-router-dom'

export const UserContext = React.createContext()

export const UserStorage = ({ children }) => {
    const [data, setData] = React.useState(null)
    const [login, setLogin] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const navigate = useNavigate()

    const userLogout = React.useCallback(async () => {
        setData(null)
        setError(null)
        setLoading(false)
        setLogin(false)
        window.localStorage.removeItem('token')
    }, [])

    React.useEffect(() => {
        async function autoLogin() {
            const token = window.localStorage.getItem('token')

            if (token) {
                try {
                    setError(null)
                    setLoading(true)
                    await getUser()
                } catch (err) {
                    setError(err.message)
                    userLogout()
                } finally {
                    setLoading(false)
                }
            } else {
                setLogin(false)
            }
        }
        autoLogin()
    }, [])

    const getUser = async () => {
        const { url, options } = GET_USER()
        const response = await fetch(url, options)
        const json = await response.json()

        if (!response.ok) {
            throw new Error(json.message || 'Sessão inválida')
        }

        setData(json)
        setLogin(true)
    }

    const userLogin = async (email, password) => {
        try {
            setError(null)
            setLoading(true)

            const { url, options } = LOGIN_USER({ email, password })
            const response = await fetch(url, options)
            const json = await response.json()

            if (!response.ok) {
                throw new Error(json.message || 'Credenciais inválidas. Tente novamente')
            }

            window.localStorage.setItem('token', json.data.access_token)
            await getUser()
            navigate('/articles')
        } catch (err) {
            setError(err.message)
            setLogin(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <UserContext.Provider value={{ userLogin, userLogout, data, error, loading, login }}>
            {children}
        </UserContext.Provider>
    )
}
