import { ReactNode } from 'react'
import '../styles/question.scss'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    // reactnode qualquer conteudo tsx de dentro do react
    children?: ReactNode
}


export function Question({
    content,
    author,
    children
}: QuestionProps){
    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={''} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}