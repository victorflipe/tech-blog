import React, { useContext } from 'react'
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
        <div className={depth > 0 ? 'mt-5 ml-6 pl-4 border-l border-[#E6E6E6]' : 'py-6 border-b border-[#E6E6E6]'}>
            <div className="flex">
                <img className="rounded-full w-8 h-8 object-cover" src={Avatar} alt="" />
                <div className="w-full ml-3">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-2 items-baseline font-inter">
                            <p className="text-sm font-medium text-[#242424]">{item.author.name}</p>
                            <p className="text-xs text-[#6B6B6B]">{diffDate(item.created_at)}</p>
                        </div>
                        {canDelete && (
                            <button type="button" onClick={() => onDelete(item.id)}>
                                <img className="icons w-4 h-4" src={IconTrash} alt="Excluir comentário" />
                            </button>
                        )}
                    </div>
                    <div className="mt-2 text-[16px] leading-relaxed text-[#242424]">{item.comment}</div>
                    {currentUserId && (
                        <div className="mt-3">
                            <button type="button" className="cursor-pointer" onClick={() => onReply(item.id)}>
                                <img className="icons w-4 h-4" src={IconReply} alt="Responder" />
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
    const [replyToId, setReplyToId] = React.useState(null)

    const { request } = useFetch()
    const [comments, setComments] = React.useState([])
    const [commentDelete, setCommentDelete] = React.useState(null)
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [deleteArticleOpen, setDeleteArticleOpen] = React.useState(false)
    const [, setTagsFiltered] = React.useState([])

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
        return <p className="p-16 text-center text-[#6B6B6B] font-newsreader text-xl">Carregando artigo...</p>
    }

    if (!article) {
        return <p className="p-16 text-center text-[#6B6B6B] font-newsreader text-xl">Artigo não encontrado.</p>
    }

    const isAuthor = currentUser && article.author?.id === currentUser.id

    return (
        <article className="max-w-[680px] mx-auto px-5 py-12">
            <h1 className="font-newsreader text-[40px] lg:text-[42px] leading-tight tracking-tight text-[#242424]">
                {article.title}
            </h1>

            <div className="flex items-center justify-between gap-4 mt-6 mb-8">
                <div>
                    <p className="text-sm font-medium text-[#242424] font-inter">{article.author.name}</p>
                    <p className="text-xs text-[#6B6B6B] mt-1 font-inter">{formatDate(article.created_at)}</p>
                </div>
                {isAuthor && (
                    <div className="flex gap-4 text-sm font-inter">
                        <Link to={`/articles/${article.id}/edit`} state={{ article }} className="text-[#6B6B6B] hover:text-[#242424]">
                            Editar
                        </Link>
                        <button
                            type="button"
                            className="text-[#6B6B6B] hover:text-[#C01717] cursor-pointer"
                            onClick={() => setDeleteArticleOpen(true)}
                        >
                            Excluir
                        </button>
                    </div>
                )}
            </div>

            {article.tags?.length > 0 && (
                <div className="mb-8">
                    <TagsList isActive={false} tagsArticle={article.tags} setTagsFiltered={setTagsFiltered} />
                </div>
            )}

            <MarkdownContent>{article.content}</MarkdownContent>

            <section className="mt-16 pt-8 border-t border-[#E6E6E6]">
                <h2 className="font-newsreader text-2xl mb-6">Respostas</h2>
                {login ? (
                    <>
                        {replyToId && (
                            <p className="text-sm text-[#6B6B6B] mb-2 font-inter">
                                Respondendo comentário #{replyToId}{' '}
                                <button type="button" className="underline" onClick={() => setReplyToId(null)}>
                                    Cancelar
                                </button>
                            </p>
                        )}
                        <TextArea label="Comentário" placeholder="Escreva um comentário" rows={6} {...comment} />
                        <Button onClick={onSubmitComment}>Publicar</Button>
                    </>
                ) : (
                    <p className="text-[#6B6B6B] font-inter text-sm">
                        <Link to="/login" className="text-[#1A8917] font-medium">
                            Entre
                        </Link>
                        {' '}para comentar neste artigo.
                    </p>
                )}
            </section>

            <section className="mt-6 pb-16">
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
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2">Excluir comentário</h1>
                        <p className="text-sm text-center text-[#6B6B6B] pb-6">Tem certeza que deseja excluir o comentário?</p>
                        <div className="flex gap-2 justify-center">
                            <button type="button" className="button-cancel" onClick={() => setIsOpen(false)}>Cancelar</button>
                            <button type="button" className="button-danger" onClick={onDeleteComment}>Excluir</button>
                        </div>
                    </div>
                </Modal>
            )}

            {confirmDelete && (
                <Modal onClose={() => setConfirmDelete(false)}>
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2">Comentário excluído com sucesso!</h1>
                    </div>
                </Modal>
            )}

            {deleteArticleOpen && (
                <Modal onClose={() => setDeleteArticleOpen(false)}>
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2">Excluir artigo</h1>
                        <p className="text-sm text-center text-[#6B6B6B] pb-6">Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-2 justify-center">
                            <button type="button" className="button-cancel" onClick={() => setDeleteArticleOpen(false)}>Cancelar</button>
                            <button type="button" className="button-danger" onClick={onDeleteArticle}>Excluir</button>
                        </div>
                    </div>
                </Modal>
            )}
        </article>
    )
}

export default ArticleRead
