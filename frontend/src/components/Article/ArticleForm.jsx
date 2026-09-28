import React from 'react'
import useForm from '../../hooks/useForm'
import Input from '../Forms/Input'
import TextArea from '../Forms/TextArea'
import TagsList from '../Tags/TagsList'
import ArticleHeader from './ArticleHeader'
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
    const [isOpen, setIsOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [tagsFiltered, setTagsFiltered] = React.useState([])
    const [isMobile] = React.useState(() => window.innerWidth <= 768)
    const [showPreview, setShowPreview] = React.useState(false)

    const titleHeader = !article ? "Novo artigo" : "Editar artigo"
    const textButton = !article ? "Criar artigo" : "Salvar artigo"

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!title.validate() || !content.validate()){
            return
        }

        const createObj = {
            title: title.value,
            content: content.value,
            image: image.value,
            tags: tagsFiltered.map(tagItem => tagItem.tag)
        }

        // return

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
        <section className='w-full lg:mt-5 md:px-[5rem]'>

            <ArticleHeader>
                <div className="flex items-center justify-between py-2">
                    <h1 className='text-3xl font-semibold'>{titleHeader}</h1>
                    {!isMobile && <Button onClick={handleSubmit}>{textButton}</Button>}
                </div>
            </ArticleHeader>

            <form onSubmit={handleSubmit}>

                <Input label={"Título do artigo *"} name="title" {...title} placeholder="Título" />

                <Input label={"Imagem do artigo"} name="image" {...image} placeholder="URL da imagem" error={false}/>

                <div className='mb-5'>
                    <TagsList update={true} tagsSelectedArticle={article ? article.tags : []} setTagsFiltered={setTagsFiltered} />
                </div>

                <TextArea label="Conteúdo * (Markdown)" name="conteúdo" placeholder="Escreva aqui seu artigo" {...content} />

                <div className="mb-5">
                    <button
                        type="button"
                        className="text-[#67A22D] font-semibold underline cursor-pointer"
                        onClick={() => setShowPreview((prev) => !prev)}
                    >
                        {showPreview ? 'Ocultar preview' : 'Preview Markdown'}
                    </button>
                    {showPreview && (
                        <div className="mt-3 p-4 border border-[#EDF2E8] rounded-xl">
                            <MarkdownContent>{content.value}</MarkdownContent>
                        </div>
                    )}
                </div>

                {isMobile && <Button classButton={"w-full"} onClick={handleSubmit}>{textButton}</Button>}
            </form>

            {isOpen && <Modal onClose={handleClickModal} >
                <div className='w-70 h-50 p-2 flex flex-col justify-center font-newsreader'>
                    <h1 className={`text-lg text-center font-semibold pb-2`}>{message}</h1>
                </div>
            </Modal>}
        </section>
    )
}

export default ArticleForm