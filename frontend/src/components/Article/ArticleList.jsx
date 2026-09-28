import React from 'react'
import ArticleHeader from './ArticleHeader'
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
    <section className='mb-10 md:px-[5rem]'>
      <ArticleHeader>
        <div className="flex justify-between items-center py-2">
          <h1 className='text-3xl font-semibold'>{"Todos os Artigos"}</h1>
          {login && (
            <Button onClick={() => navigate('/articles/new')}>Criar artigo</Button>
          )}
        </div>
      </ArticleHeader>

      <div className='mt-5'>
        <Input placeholder={"Pesquisar (mín. 2 caracteres)"} name="Pesquisar" {...filter} error={false} />
        <TagsList setTagsFiltered={setTagsFiltered} />

        <ArticleListItems articles={articles} onDeleted={fetchArticles} />
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex gap-2 mt-10 pb-10 justify-center">
          {Array.from({ length: pagination.pages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded-full cursor-pointer ${page === idx + 1 ? "bg-[#EDF2E8]" : ""
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
