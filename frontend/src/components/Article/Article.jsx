import React from 'react'
import ArticleList from './ArticleList'
import ArticleNew from './ArticleNew'
import { Route, Routes } from 'react-router-dom'
import ArticleRead from './ArticleRead'
import ArticleEdit from './ArticleEdit'

const Article = () => {
    return (
        <section className='lg:px-[10rem]'>
            <Routes>
                <Route path="/" element={<ArticleList />} />
                <Route path="/new" element={<ArticleNew />} />
                <Route path="/:articleId" element={<ArticleRead />} />
                <Route path="/:articleId/edit" element={<ArticleEdit />} />
            </Routes>
        </section>
    )
}

export default Article
