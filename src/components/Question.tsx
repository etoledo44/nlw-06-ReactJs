import { ReactNode } from 'react'
import cx from 'classnames'
import '../styles/question.scss'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    // reactnode qualquer conteudo tsx de dentro do react
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}


export function Question({
    content,
    author,
    isAnswered = false,
    isHighLighted = false,
    children
}: QuestionProps){

    console.log('*** QuestionComp teste:', author)
    return (
        <div 
        // className={`question ${isAnswered ? 'answered' : ''} ${isHighLighted? 'highlighted' : ''}`}>
        // usando classnames para simoplificar codigo e não usar os ternarios
        className={cx(
            'question',
            {answered: isAnswered},
            {highlighted: isHighLighted && !isAnswered})} > 
        <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src='' alt='' />
                    <span>''</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}