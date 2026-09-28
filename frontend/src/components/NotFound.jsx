import React from 'react'

const NotFound = () => {
    return (
        <div className="h-[calc(100dvh-72px)] flex items-center justify-center px-6 text-center">
            <div className="max-w-[680px]">
                <p className="text-sm tracking-wide uppercase text-[#6B6B6B] font-inter">Erro 404</p>
                <h1 className="font-newsreader text-4xl mt-3 mb-4">Página não encontrada</h1>
                <a href="/articles" className="text-[#1A8917] font-medium text-sm">
                    Voltar aos artigos
                </a>
            </div>
        </div>
    )
}

export default NotFound
