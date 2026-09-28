import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useFetch from './useFetch'
import { GET_ARTICLE } from '../api'

export default function useArticle() {
    const { articleId } = useParams()
    const location = useLocation()
    const initial = location.state?.article
    const { request } = useFetch()
    const [article, setArticle] = React.useState(
        initial && String(initial.id) === String(articleId) ? initial : null,
    )
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (initial && String(initial.id) === String(articleId)) {
            setArticle(initial)
            setLoading(false)
            return
        }

        async function load() {
            setLoading(true)
            const { url, options } = GET_ARTICLE(articleId)
            const { json } = await request(url, options)
            setArticle(json?.data ?? null)
            setLoading(false)
        }

        if (articleId) {
            load()
        }
    }, [articleId, initial, request])

    return { article, loading }
}
