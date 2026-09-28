import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../Forms/Button'
import useForm from '../../hooks/useForm'
import Input from '../Forms/Input'
import { UserContext } from '../../UserContext'
import Modal from '../Modal/Modal'

const LoginForm = () => {
    const email = useForm()
    const password = useForm()
    const { userLogin, error } = React.useContext(UserContext)
    const [message, setMessage] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            if (email.validate() && password.validate()) {
                await userLogin(email.value, password.value)

                if (error) {
                    setMessage(error)
                    setIsOpen(true)
                }
            }
        } catch {
            setMessage('Erro ao efetuar login')
            setIsOpen(true)
        }
    }

    return (
        <section className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">
            <div className="hidden lg:flex bg-[#F9F7F4] px-16 items-center">
                <blockquote className="max-w-md">
                    <p className="font-newsreader italic text-3xl text-[#242424] leading-snug">
                        A escrita clara é o reflexo de um pensamento rigoroso.
                    </p>
                    <p className="mt-6 text-sm text-[#6B6B6B]">Editorial TechBlog</p>
                </blockquote>
            </div>

            <div className="flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-[420px]">
                    <h1 className="font-newsreader text-[40px] tracking-tight mb-2">Bem-vindo de volta</h1>
                    <p className="text-[#6B6B6B] text-sm mb-8">Entre para escrever e comentar.</p>
                    <form onSubmit={handleLogin}>
                        <Input label="Email" name="email" {...email} placeholder="seu@email.com" />
                        <Input label="Senha" name="senha" {...password} type="password" placeholder="Senha" />
                        <Button classButton="w-full">Entrar</Button>
                    </form>
                    <p className="text-center mt-6 text-sm text-[#6B6B6B]">
                        Não tem conta?{' '}
                        <Link to="/login/register" className="text-[#1A8917] font-medium">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
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

export default LoginForm
