import React from 'react'
import useForm from '../../hooks/useForm'
import Input from '../Forms/Input'
import TextArea from '../Forms/TextArea'
import TagsList from '../Tags/TagsList'
import Button from '../Forms/Button'
import { POST_ARTICLE, UPDATE_ARTICLE } from '../../api'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import Modal from '../Modal/Modal'
import MarkdownContent from '../Markdown/MarkdownContent'

const ArticleForm = ({ article }) => {
    const title = useForm()
    const image = useForm()
    const content = useForm('')
    const { request } = useFetch()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = React.useState(false)
    const [message, setMessage] = React.useState('')
    const [tagsFiltered, setTagsFiltered] = React.useState([])
    const [showPreview, setShowPreview] = React.useState(false)

    const titleHeader = !article ? 'Escrever' : 'Editar artigo'
    const textButton = !article ? 'Publicar' : 'Salvar'

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!title.validate() || !content.validate()) {
            return
        }

        const createObj = {
            title: title.value,
            content: content.value,
            image: image.value,
            tags: tagsFiltered.map((tagItem) => tagItem.tag),
        }

        if (article) {
            const { url, options } = UPDATE_ARTICLE(article.id, createObj)
            const { json } = await request(url, options)
            setMessage(json.message)
            setIsOpen(true)
        } else {
            const { url, options } = POST_ARTICLE(createObj)
            const { json } = await request(url, options)
            setMessage(json.message)
            setIsOpen(true)
        }
    }

    const handleClickModal = () => {
        setIsOpen(false)
        navigate('/articles')
    }

    React.useEffect(() => {
        if (article) {
            title.setValue(article.title)
            image.setValue(article.image)
            content.setValue(article.content)
            setTagsFiltered(article.tags)
        }
    }, [])

    return (
        <section className="max-w-[728px] mx-auto px-5 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-newsreader text-4xl tracking-tight">{titleHeader}</h1>
                <Button onClick={handleSubmit}>{textButton}</Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Input label="Título *" name="title" {...title} placeholder="Título do artigo" />
                <Input label="Imagem" name="image" {...image} placeholder="URL da imagem" error={false} />

                <div className="mb-5">
                    <p className="text-[13px] font-medium mb-2 font-inter">Tags</p>
                    <TagsList update={true} tagsSelectedArticle={article ? article.tags : []} setTagsFiltered={setTagsFiltered} />
                </div>

                <TextArea label="Conteúdo * (Markdown)" name="conteúdo" placeholder="Escreva aqui seu artigo" {...content} />

                <div className="mb-8">
                    <button
                        type="button"
                        className="text-[#1A8917] font-medium text-sm cursor-pointer font-inter"
                        onClick={() => setShowPreview((prev) => !prev)}
                    >
                        {showPreview ? 'Ocultar preview' : 'Preview Markdown'}
                    </button>
                    {showPreview && (
                        <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                            <MarkdownContent>{content.value}</MarkdownContent>
                        </div>
                    )}
                </div>
            </form>

            {isOpen && (
                <Modal onClose={handleClickModal}>
                    <div className="w-70 p-2 flex flex-col justify-center">
                        <h1 className="text-lg text-center font-medium pb-2">{message}</h1>
                    </div>
                </Modal>
            )}
        </section>
    )
}

export default ArticleForm
