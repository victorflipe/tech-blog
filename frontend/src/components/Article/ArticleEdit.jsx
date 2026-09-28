import React from 'react'
import ArticleForm from './ArticleForm'
import useArticle from '../../hooks/useArticle'

const ArticleEdit = () => {
    const { article, loading } = useArticle()

    if (loading) {
        return <p className="p-10 text-center">Carregando artigo...</p>
    }

    if (!article) {
        return <p className="p-10 text-center">Artigo não encontrado.</p>
    }

    return (
        <section>
            <ArticleForm article={article} />
        </section>
    )
}

export default ArticleEdit
