import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '@/UserContext'
import IconEdit from '@/assets/edit.svg'
import NoImage from '@/assets/no-image.png'

const ArticleListItems = ({ articles }) => {

    const { data } = useContext(UserContext)
    let user = null
    if (data)
        user = data.data

    return (
        <section>
            {articles.map((article) => (
                <div className='w-auto flex' key={article.id}>
                    <Link to={`/${article.id}`} className='flex-1' state={{ article: article }} >
                        <div className='flex mb-2 my-8'>
                            <img
                                className="md:w-32 md:h-26 h-12 w-12 object-cover rounded-xl"
                                src={article.image ? (article.image.includes('http') ? article.image : NoImage) : NoImage}
                                alt=""
                            />
                            <div className='pl-5 flex-1 flex flex-col justify-between'>
                                <div>
                                    <div className='flex'>
                                        <span className='flex font-bold'>{article.title}</span>
                                        <div className='pl-2 md:hidden w-auto overflow-x-auto'>
                                            {/* <span className='text-xs tags'>{article.tags[0].tag}</span> */}
                                            {/* {article.tags.map((tag, idx) => (
                                            ))} */}
                                        </div>
                                    </div>
                                    <p className='text-lg text-green'>
                                        {article.content.length > 100 ? article.content.substring(0, 100) + "..." : article.content}
                                    </p>
                                </div>
                                <div className='hidden md:flex'>
                                    {article.tags.map((tag, idx) => (
                                        <span key={idx} className='tags'>{tag.tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                    {article ? article.author.id == user.id && <div className='flex items-center'>
                        <Link to={`/${article.id}/edit`} state={{ article: article }}>
                            <img src={IconEdit} alt="edit article" />
                        </Link>
                    </div> : <></>}
                </div>

            ))}
            <div className='text-lg text-center pt-10'>
                {!articles.length && <div>Nenhum registro encontrado</div>}
            </div>
        </section>
    )
}

export default ArticleListItems