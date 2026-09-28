import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../Forms/Button'
import useForm from '../../hooks/useForm'
import Input from '../Forms/Input'
import { REGISTER_USER } from '../../api'
import Modal from '../Modal/Modal'

const RegisterForm = () => {
    const name = useForm()
    const email = useForm('email')
    const password = useForm('password')
    const navigate = useNavigate()
    const [message, setMessage] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleRegister = async (event) => {
        event.preventDefault()

        if (!name.validate() || !email.validate() || !password.validate()) {
            return
        }

        try {
            setLoading(true)
            const { url, options } = REGISTER_USER({
                name: name.value,
                email: email.value,
                password: password.value,
            })
            const response = await fetch(url, options)
            const json = await response.json()

            if (!response.ok) {
                throw new Error(json.message || 'Não foi possível criar a conta')
            }

            navigate('/login', { state: { registered: true } })
        } catch (err) {
            setMessage(err.message)
            setIsOpen(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='w-full lg:py-10'>
            <h1 className='text-4xl text-center font-semibold pb-5'>Criar conta</h1>
            <div className='mainContainer'>
                <form onSubmit={handleRegister} className='w-[40rem]'>
                    <Input label="Nome" name="name" {...name} placeholder="Seu nome" h="h-[2rem]" />
                    <Input label="Email" name="email" {...email} placeholder="Email" h="h-[2rem]" />
                    <Input label="Senha" name="password" {...password} placeholder="Senha" h="h-[2rem]" />
                    <Button classButton="w-full" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Já tem conta? <Link to="/login" className="underline">Entrar</Link>
                </p>
            </div>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2 text-red-600'>{message}</h1>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default RegisterForm
