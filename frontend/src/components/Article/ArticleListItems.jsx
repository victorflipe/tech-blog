import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '@/UserContext'
import IconEdit from '@/assets/edit.svg'
import IconTrash from '@/assets/trash.svg'
import NoImage from '@/assets/no-image.png'
import useFetch from '../../hooks/useFetch'
import { DELETE_ARTICLE } from '../../api'
import Modal from '../Modal/Modal'

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

    return (
        <section>
            {articles.map((article) => (
                <div className='w-auto flex' key={article.id}>
                    <Link to={`/articles/${article.id}`} className='flex-1' state={{ article: article }} >
                        <div className='flex mb-2 my-8'>
                            <img
                                className="md:w-32 md:h-26 h-12 w-12 object-cover rounded-xl"
                                src={article.image ? (article.image.includes('http') ? article.image : NoImage) : NoImage}
                                alt=""
                            />
                            <div className='pl-5 flex-1 flex flex-col justify-between'>
                                <div>
                                    <div className='flex'>
                                        <span className='flex font-bold'>{article.title}</span>
                                    </div>
                                    <p className='text-lg text-green'>
                                        {article.content.length > 100 ? article.content.substring(0, 100) + "..." : article.content}
                                    </p>
                                </div>
                                <div className='hidden md:flex'>
                                    {article.tags.map((tag, idx) => (
                                        <span key={idx} className='tags'>{tag.tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                    {user && article.author.id === user.id && (
                        <div className='flex items-center gap-3'>
                            <Link to={`/articles/${article.id}/edit`} state={{ article: article }}>
                                <img src={IconEdit} alt="edit article" />
                            </Link>
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => {
                                    setDeleteId(article.id)
                                    setIsOpen(true)
                                }}
                            >
                                <img src={IconTrash} alt="excluir artigo" />
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <div className='text-lg text-center pt-10'>
                {!articles.length && <div>Nenhum registro encontrado</div>}
            </div>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2'>Excluir artigo</h1>
                        <p className='text-md text-center font-base pb-6'>Tem certeza que deseja excluir este artigo?</p>
                        <div className='flex h-12 gap-2 justify-center'>
                            <button type="button" className='button-cancel' onClick={() => setIsOpen(false)}>Cancelar</button>
                            <button type="button" className='button-danger' onClick={confirmDelete}>Excluir</button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default ArticleListItems
