import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="bg-[#F9F7F4] h-[calc(100dvh-72px)]">
      <section className="h-full max-w-[1192px] mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <p className="font-inter text-xs tracking-[0.12em] uppercase text-[#1A8917] mb-6">
            Edição editorial
          </p>
          <h1 className="font-newsreader text-5xl lg:text-6xl tracking-tight text-[#242424] mb-5">
            Insights & Learning
          </h1>
          <p className="text-xl text-[#6B6B6B] mb-10 max-w-xl font-newsreader leading-relaxed">
            Explorando as tendências tech, um texto por vez.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/articles" className="button">
              Começar a ler
            </Link>
            <Link to="/login" className="text-sm font-medium text-[#1A8917] font-inter">
              Começar a escrever →
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 hidden lg:block">
          <p className="font-newsreader italic text-2xl text-[#6B6B6B] leading-snug">
            “A escrita clara é o reflexo de um pensamento rigoroso.”
          </p>
          <p className="mt-4 text-sm text-[#6B6B6B] font-inter">Editorial TechBlog</p>
        </div>
      </section>
    </div>
  )
}

export default Home
