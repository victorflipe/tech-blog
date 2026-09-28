import React from 'react'
import ArticleList from './ArticleList'
import ArticleNew from './ArticleNew'
import { Route, Routes } from 'react-router-dom'
import ArticleRead from './ArticleRead'
import ArticleEdit from './ArticleEdit'
import ProtectedRoutes from '../Helper/ProtectedRoutes'

const Article = () => {
    return (
        <section className='lg:px-[10rem]'>
            <Routes>
                <Route path="/" element={<ArticleList />} />
                <Route path="/new" element={<ProtectedRoutes><ArticleNew /></ProtectedRoutes>} />
                <Route path="/:articleId" element={<ArticleRead />} />
                <Route path="/:articleId/edit" element={<ProtectedRoutes><ArticleEdit /></ProtectedRoutes>} />
            </Routes>
        </section>
    )
}

export default Article
