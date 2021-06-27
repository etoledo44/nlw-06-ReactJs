import firebase from 'firebase'
import { FormEvent, useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImage from '../assets/images/delete.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../contexts/authContext'
import { database } from '../services/firebase'

import { useRoom } from '../Hooks/useRoom'


import '../styles/room.scss'
import { isFunctionTypeNode } from 'typescript'

type ParamsType = {
    id: string
}


export function AdminRoom(){

    const {user} = useAuth()
    const params = useParams<ParamsType>()

    const history = useHistory()

    const [newQuestion, setNewQuestion] = useState('')
   
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
           const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
       } 
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
                            >
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