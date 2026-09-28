import ReactMarkdown from 'react-markdown'

const MarkdownContent = ({ children, className = '' }) => {
    return (
        <div className={`article-markdown ${className}`.trim()}>
            <ReactMarkdown>{children || ''}</ReactMarkdown>
        </div>
    )
}

export default MarkdownContent
