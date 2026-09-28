import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '@/UserContext'
import NoImage from '@/assets/no-image.png'
import useFetch from '../../hooks/useFetch'
import { DELETE_ARTICLE } from '../../api'
import Modal from '../Modal/Modal'
import { formatDate } from '../../utils/date'
import { shortContent } from '../../utils/text'

const ArticleListItems = ({ articles, onDeleted }) => {
    const { data } = useContext(UserContext)
    const { request } = useFetch()
    const [deleteId, setDeleteId] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const user = data?.data ?? null

    const confirmDelete = async () => {
        const { url, options } = DELETE_ARTICLE(deleteId)
        const { response } = await request(url, options)
        if (response?.ok) {
            setIsOpen(false)
            setDeleteId(null)
            onDeleted?.()
        }
    }

    const imageSrc = (article) =>
        article.image && article.image.includes('http') ? article.image : NoImage

    return (
        <section>
            {articles.map((article) => (
                <article
                    key={article.id}
                    className="py-8 border-b border-[#E6E6E6] flex gap-6 items-start"
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#6B6B6B] mb-2 font-inter">
                            {article.author?.name} · {formatDate(article.created_at)}
                        </p>
                        <Link to={`/articles/${article.id}`} state={{ article }}>
                            <h2 className="font-newsreader text-[22px] leading-snug text-[#242424] hover:underline">
                                {article.title}
                            </h2>
                            <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed line-clamp-2">
                                {shortContent(article.content, 160)}
                            </p>
                        </Link>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {article.tags?.map((tag, idx) => (
                                <span key={idx} className="tags mb-0">
                                    {tag.tag}
                                </span>
                            ))}
                            {user && article.author?.id === user.id && (
                                <span className="ml-auto flex gap-3 text-xs font-inter">
                                    <Link to={`/articles/${article.id}/edit`} state={{ article }} className="text-[#6B6B6B] hover:text-[#242424]">
                                        Editar
                                    </Link>
                                    <button
                                        type="button"
                                        className="text-[#6B6B6B] hover:text-[#C01717] cursor-pointer"
                                        onClick={() => {
                                            setDeleteId(article.id)
                                            setIsOpen(true)
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                    <Link to={`/articles/${article.id}`} state={{ article }} className="shrink-0 hidden sm:block">
                        <img
                            className="w-[112px] h-[112px] object-cover rounded"
                            src={imageSrc(article)}
                            alt=""
                        />
                    </Link>
                </article>
            ))}
            {!articles.length && (
                <p className="text-center text-[#6B6B6B] py-16 font-newsreader text-xl">
                    Nenhum registro encontrado
                </p>
            )}

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2">Excluir artigo</h1>
                        <p className="text-sm text-center text-[#6B6B6B] pb-6">
                            Tem certeza que deseja excluir este artigo?
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button type="button" className="button-cancel" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="button-danger" onClick={confirmDelete}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default ArticleListItems
