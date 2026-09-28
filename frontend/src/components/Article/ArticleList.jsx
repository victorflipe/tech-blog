import React from 'react'
import Button from '../Forms/Button'
import { useNavigate } from 'react-router-dom'
import TagsList from '../Tags/TagsList'
import Input from '../Forms/Input'
import ArticleListItems from './ArticleListItems'
import useFetch from '../../hooks/useFetch'
import { GET_ARTICLES } from '../../api'
import useForm from '../../hooks/useForm'
import { UserContext } from '../../UserContext'

const ArticleList = () => {
  const navigate = useNavigate()
  const { login } = React.useContext(UserContext)
  const { request } = useFetch()
  const filter = useForm('')

  const [articles, setArticles] = React.useState([])
  const [tagsFiltered, setTagsFiltered] = React.useState([])
  const [pagination, setPagination] = React.useState(null)
  const [page, setPage] = React.useState(1)

  const searchQuery = filter.value.trim().length >= 2 ? filter.value.trim() : undefined
  const tagsQuery =
    tagsFiltered.length > 0 ? tagsFiltered.map((t) => t.tag).join(',') : undefined

  async function fetchArticles() {
    const limit = 10
    const skip = Math.max((page - 1) * limit, 0)
    const { url, options } = GET_ARTICLES(skip, limit, { q: searchQuery, tags: tagsQuery })
    const { json } = await request(url, options)

    setArticles(json.data ?? [])
    setPagination(json.pagination ?? null)
  }

  React.useEffect(() => {
    setPage(1)
  }, [filter.value, tagsFiltered])

  React.useEffect(() => {
    fetchArticles()
  }, [page, searchQuery, tagsQuery])

  return (
    <section className="max-w-[1192px] mx-auto px-5 lg:px-8 py-10">
      <div className="flex justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="font-newsreader text-4xl tracking-tight">Para você</h1>
          <p className="text-sm text-[#6B6B6B] mt-2">Histórias da comunidade TechBlog</p>
        </div>
        {login && (
          <Button onClick={() => navigate('/articles/new')}>Escrever</Button>
        )}
      </div>

      <Input placeholder="Pesquisar (mín. 2 caracteres)" name="Pesquisar" {...filter} error={false} />
      <TagsList setTagsFiltered={setTagsFiltered} />
      <ArticleListItems articles={articles} onDeleted={fetchArticles} />

      {pagination && pagination.pages > 1 && (
        <div className="flex gap-2 mt-10 pb-10 justify-center font-inter">
          {Array.from({ length: pagination.pages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                page === idx + 1 ? 'bg-[#F2F2F2] text-[#242424]' : 'text-[#6B6B6B]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default ArticleList
