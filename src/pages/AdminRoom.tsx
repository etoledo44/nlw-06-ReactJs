
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import deleteImage from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'

import { useRoom } from '../Hooks/useRoom'


import '../styles/room.scss'

type ParamsType = {
    id: string
}


export function AdminRoom(){

    const params = useParams<ParamsType>()

    const history = useHistory()

   
    const roomId = params.id
    const {questions, title } = useRoom(roomId)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
       if (window.confirm('Tem certeza que deseja deletar essa pergunta?')) {
           await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
       } 
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                            >Encerrar Sala
                        </Button>

                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1> Sala {title}</h1>
                    {questions.length > 0 ? 
                        (<span>{questions.length} perguntas</span>) 
                        :
                        ''
                    }
                    
                </div>
                <div className="question-list">

                    {questions.map(question => {
                        return (
                            <Question key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered = {question.isAnswered}
                                isHighLighted = {question.isHighLighted} 
                            >
                                 {!question.isAnswered && (
                                     <>
                                        <button
                                            type="button"
                                            onClick={()=>handleCheckQuestionAsAnswered(question.id)}>
                                            <img src={checkImg} alt="Check question" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={()=>handleHighlightQuestion(question.id)}>
                                            <img src={answerImg} alt="highlight question" />
                                        </button>
                                     </>
                                 )}
                                <button
                                    type="button"
                                    onClick={()=>handleDeleteQuestion(question.id)}>
                                    <img src={deleteImage} alt="Delete question" />
                                </button>
                            </Question>
                        )
                    })}

                </div>
                
            </main>
        </div>
    )
}