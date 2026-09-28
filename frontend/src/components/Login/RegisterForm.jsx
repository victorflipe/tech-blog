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
        <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-[420px]">
                <h1 className="font-newsreader text-[40px] tracking-tight mb-2">Crie sua conta</h1>
                <p className="text-[#6B6B6B] text-sm mb-8">
                    Junte-se para ler, escrever e compartilhar ideias.
                </p>
                <form onSubmit={handleRegister}>
                    <Input label="Nome" name="name" {...name} placeholder="Seu nome" />
                    <Input label="Email" name="email" {...email} placeholder="seu@email.com" />
                    <Input label="Senha" name="password" {...password} type="password" placeholder="Mínimo 8 caracteres" />
                    <Button classButton="w-full" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                </form>
                <p className="text-center mt-6 text-sm text-[#6B6B6B]">
                    Já tem conta?{' '}
                    <Link to="/login" className="text-[#1A8917] font-medium">
                        Entrar
                    </Link>
                </p>
                <p className="text-center mt-8 text-xs text-[#6B6B6B]">
                    Ao continuar, você concorda com os termos do TechBlog.
                </p>
            </div>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2 text-red-600">{message}</h1>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default RegisterForm
