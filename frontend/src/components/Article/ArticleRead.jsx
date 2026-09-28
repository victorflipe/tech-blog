import React from 'react'
import ArticleHeader from './ArticleHeader'
import TagsList from '../Tags/TagsList'
import TextArea from '../Forms/TextArea'
import useFetch from '../../hooks/useFetch'
import useArticle from '../../hooks/useArticle'
import { GET_COMMENTS, POST_COMMENT, DELETE_COMMENT } from '../../api'
import IconReply from '../../assets/reply.svg'
import IconTrash from '../../assets/trash.svg'
import Button from '../Forms/Button'
import useForm from '../../hooks/useForm'
import { formatDate, diffDate } from '../../utils/date'
import Modal from '../Modal/Modal'
import Avatar from '@/assets/avatar.svg'

const ArticleRead = () => {
    const { article, loading } = useArticle()
    const comment = useForm()
    const [isOpen, setIsOpen] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768)

    const { request } = useFetch()
    const [comments, setComments] = React.useState([])
    const [commentDelete, setCommentDelete] = React.useState(null)
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [tagsFiltered, setTagsFiltered] = React.useState([])

    async function fetchComments() {
        if (!article?.id) return
        const { url, options } = GET_COMMENTS(article.id)
        const { json } = await request(url, options)
        setComments(json?.data ?? [])
    }

    React.useEffect(() => {
        fetchComments()
    }, [article?.id])

    const onSubmitComment = async () => {
        if (comment.validate() && article?.id) {
            const body = { comment: comment.value }
            const { url, options } = POST_COMMENT(article.id, body)
            await request(url, options)
            fetchComments()
            comment.setValue('')
        }
    }

    const modalDelete = (id) => {
        setCommentDelete(id)
        setIsOpen(true)
    }

    const onDeleteComment = async () => {
        const { url, options } = DELETE_COMMENT(commentDelete)
        await request(url, options)
        fetchComments()
        setConfirmDelete(true)
        setIsOpen(false)
    }

    if (loading) {
        return <p className="p-10 text-center">Carregando artigo...</p>
    }

    if (!article) {
        return <p className="p-10 text-center">Artigo não encontrado.</p>
    }

    return (
        <section className=''>
            <ArticleHeader>
                <div className="flex items-center py-2">
                    <h1 className='text-3xl font-semibold pr-2'>{article.title}</h1>
                    {!isMobile && <TagsList isActive={false} tagsArticle={article.tags} setTagsFiltered={setTagsFiltered} />}
                </div>
            </ArticleHeader>

            <p className='text-[#758269]'>Publicado por {article.author.name} - {formatDate(article.created_at)}</p>

            {isMobile && article.tags?.length > 0 && (
                <TagsList isActive={false} tagsArticle={article.tags} setTagsFiltered={setTagsFiltered} />
            )}

            <article className='mt-5'>{article.content}</article>

            <section className='mt-10'>
                <TextArea label="Comentários" placeholder="Escreva um comentário" rows={10} {...comment} />
                <Button onClick={onSubmitComment}>Comentar</Button>
            </section>

            <section className='mt-10 pb-10'>
                {comments.map((item) => (
                    <div key={item.id} className='mb-10 flex'>
                        <img className='rounded-full w-12 h-12 object-cover' src={Avatar} alt="" />
                        <div className='w-full ml-5'>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex gap-2'>
                                    <p className='font-bold'>{item.author.name}</p>
                                    <p>{diffDate(item.created_at)}</p>
                                </div>
                                <span>
                                    <img className='icons' src={IconTrash} alt="" onClick={() => modalDelete(item.id)} />
                                </span>
                            </div>
                            <div>{item.comment}</div>
                            <div className='mt-5'>
                                <img className='icons' src={IconReply} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2'>Excluir comentário</h1>
                        <p className='text-md text-center font-base pb-6'>Tem certeza que deseja excluir o comentário?</p>
                        <div className='flex h-12 gap-2 justify-center'>
                            <button className='button-cancel' onClick={() => setIsOpen(false)}>Cancelar</button>
                            <button className='button-danger' onClick={onDeleteComment}>excluir</button>
                        </div>
                    </div>
                </Modal>
            )}

            {confirmDelete && (
                <Modal onClose={() => setConfirmDelete(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2'>Comentário excluído com sucesso!</h1>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default ArticleRead
