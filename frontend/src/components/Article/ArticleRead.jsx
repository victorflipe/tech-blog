import React, { useContext } from 'react'
import ArticleHeader from './ArticleHeader'
import TagsList from '../Tags/TagsList'
import TextArea from '../Forms/TextArea'
import useFetch from '../../hooks/useFetch'
import useArticle from '../../hooks/useArticle'
import { GET_COMMENTS, POST_COMMENT, DELETE_COMMENT, DELETE_ARTICLE } from '../../api'
import IconReply from '../../assets/reply.svg'
import IconTrash from '../../assets/trash.svg'
import Button from '../Forms/Button'
import useForm from '../../hooks/useForm'
import { formatDate, diffDate } from '../../utils/date'
import Modal from '../Modal/Modal'
import Avatar from '@/assets/avatar.svg'
import { UserContext } from '@/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import MarkdownContent from '../Markdown/MarkdownContent'

function CommentItem({
    item,
    depth,
    currentUserId,
    onReply,
    onDelete,
}) {
    const canDelete = currentUserId && item.author?.id === currentUserId

    return (
        <div className={depth > 0 ? 'mt-4 ml-8 border-l border-[#EDF2E8] pl-4' : 'mb-10'}>
            <div className='flex'>
                <img className='rounded-full w-12 h-12 object-cover' src={Avatar} alt="" />
                <div className='w-full ml-5'>
                    <div className='flex justify-between items-center w-full'>
                        <div className='flex gap-2'>
                            <p className='font-bold'>{item.author.name}</p>
                            <p>{diffDate(item.created_at)}</p>
                        </div>
                        {canDelete && (
                            <button type="button" onClick={() => onDelete(item.id)}>
                                <img className='icons cursor-pointer' src={IconTrash} alt="Excluir comentário" />
                            </button>
                        )}
                    </div>
                    <div>{item.comment}</div>
                    {currentUserId && (
                        <div className='mt-3'>
                            <button type="button" className="cursor-pointer" onClick={() => onReply(item.id)}>
                                <img className='icons' src={IconReply} alt="Responder" />
                            </button>
                        </div>
                    )}
                    {item.replies?.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            item={reply}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

const ArticleRead = () => {
    const { article, loading } = useArticle()
    const comment = useForm()
    const { data, login } = useContext(UserContext)
    const navigate = useNavigate()
    const currentUser = data?.data ?? null

    const [isOpen, setIsOpen] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768)
    const [replyToId, setReplyToId] = React.useState(null)

    const { request } = useFetch()
    const [comments, setComments] = React.useState([])
    const [commentDelete, setCommentDelete] = React.useState(null)
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [deleteArticleOpen, setDeleteArticleOpen] = React.useState(false)
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
        if (!comment.validate() || !article?.id) return

        const body = {
            comment: comment.value,
            ...(replyToId ? { parent_comment_id: replyToId } : {}),
        }
        const { url, options } = POST_COMMENT(article.id, body)
        await request(url, options)
        fetchComments()
        comment.setValue('')
        setReplyToId(null)
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

    const onDeleteArticle = async () => {
        const { url, options } = DELETE_ARTICLE(article.id)
        const { response } = await request(url, options)
        if (response?.ok) {
            navigate('/articles')
        }
        setDeleteArticleOpen(false)
    }

    if (loading) {
        return <p className="p-10 text-center">Carregando artigo...</p>
    }

    if (!article) {
        return <p className="p-10 text-center">Artigo não encontrado.</p>
    }

    const isAuthor = currentUser && article.author?.id === currentUser.id

    return (
        <section className=''>
            <ArticleHeader>
                <div className="flex items-center justify-between py-2 gap-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <h1 className='text-3xl font-semibold pr-2 truncate'>{article.title}</h1>
                        {!isMobile && <TagsList isActive={false} tagsArticle={article.tags} setTagsFiltered={setTagsFiltered} />}
                    </div>
                    {isAuthor && (
                        <Button onClick={() => setDeleteArticleOpen(true)}>Excluir artigo</Button>
                    )}
                </div>
            </ArticleHeader>

            <p className='text-[#758269]'>Publicado por {article.author.name} - {formatDate(article.created_at)}</p>

            {isMobile && article.tags?.length > 0 && (
                <TagsList isActive={false} tagsArticle={article.tags} setTagsFiltered={setTagsFiltered} />
            )}

            <MarkdownContent className="mt-5">{article.content}</MarkdownContent>

            <section className='mt-10'>
                {login ? (
                    <>
                        {replyToId && (
                            <p className="text-sm text-[#758269] mb-2">
                                Respondendo comentário #{replyToId}{' '}
                                <button type="button" className="underline" onClick={() => setReplyToId(null)}>Cancelar</button>
                            </p>
                        )}
                        <TextArea label="Comentários" placeholder="Escreva um comentário" rows={10} {...comment} />
                        <Button onClick={onSubmitComment}>Comentar</Button>
                    </>
                ) : (
                    <p className="text-[#758269]">
                        <Link to="/login" className="text-[#67A22D] font-semibold underline">Entre</Link>
                        {' '}para comentar neste artigo.
                    </p>
                )}
            </section>

            <section className='mt-10 pb-10'>
                {comments.map((item) => (
                    <CommentItem
                        key={item.id}
                        item={item}
                        depth={0}
                        currentUserId={currentUser?.id}
                        onReply={setReplyToId}
                        onDelete={modalDelete}
                    />
                ))}
            </section>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2'>Excluir comentário</h1>
                        <p className='text-md text-center font-base pb-6'>Tem certeza que deseja excluir o comentário?</p>
                        <div className='flex h-12 gap-2 justify-center'>
                            <button type="button" className='button-cancel' onClick={() => setIsOpen(false)}>Cancelar</button>
                            <button type="button" className='button-danger' onClick={onDeleteComment}>excluir</button>
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

            {deleteArticleOpen && (
                <Modal onClose={() => setDeleteArticleOpen(false)}>
                    <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                        <h1 className='text-lg text-center font-semibold pb-2'>Excluir artigo</h1>
                        <p className='text-md text-center font-base pb-6'>Esta ação não pode ser desfeita.</p>
                        <div className='flex h-12 gap-2 justify-center'>
                            <button type="button" className='button-cancel' onClick={() => setDeleteArticleOpen(false)}>Cancelar</button>
                            <button type="button" className='button-danger' onClick={onDeleteArticle}>Excluir</button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default ArticleRead
