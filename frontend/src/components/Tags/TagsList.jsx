import React from 'react'
import useFetch from '../../hooks/useFetch'
import { GET_TAGS } from '../../api'

const TagsList = ({ tagsArticle, tagsSelectedArticle = [], setTagsFiltered, update = false }) => {
    const { request } = useFetch()
    const [tags, setTags] = React.useState([])
    const [tagsSelected, setTagsSelected] = React.useState([...tagsSelectedArticle])

    React.useEffect(() => {

        if (tagsArticle) {
            setTags(tagsArticle)
            return
        }

        async function fetchTags() {
            const { url, options } = GET_TAGS()
            const { json } = await request(url, options)
            setTags(json.data)
        }

        fetchTags()
    }, [tagsArticle])



    React.useEffect(() => {
        setTagsFiltered([...tagsSelected])
    }, [tagsSelected])

    React.useEffect(() => {

        setTagsFiltered([...tagsSelectedArticle])
    }, [])

    const handleClick = (tag) => {

        const tagExists = tagsSelected.some((item) => item.id == tag.id)

        if (tagExists) {
            const tagsFiltered = tagsSelected.filter((tag_item) => tag_item.id != tag.id)
            setTagsSelected(tagsFiltered)
            return
        }

        setTagsSelected([...tagsSelected, tag])
    }


    return (
        <section className=''>
            <div className={`w-auto flex items-center h-20 ${!update ? "overflow-x-auto" : "overflow-y-auto flex-wrap gap-2 h-40"}  `}>
                {tags.map((tag, idx) => (
                    <span key={idx} className={`tags whitespace-nowrap ${tagsSelected.map(item => item.id).includes(tag.id) ? 'tag-ativa' : ''}`} onClick={() => handleClick(tag)}>
                        {tag.tag}
                    </span>
                ))}

            </div>
        </section>
    )
}

export default TagsList