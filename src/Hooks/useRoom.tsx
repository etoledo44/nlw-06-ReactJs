import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext"
import { database } from "../services/firebase"





type Question = {
    id: string;
    author: {
        name: string,
        avatar: string
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>



export function useRoom (roomId: string){
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')
    const {user} = useAuth()



    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`)
        
        //roomRef.once = ouve o valor uma vez
        //roomRef.on = vai ficar sempre ouvindo 
        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions:FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestion = Object.entries(firebaseQuestions ).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })
            console.log('*** useRoom: ', parsedQuestion)
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestion);
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return{
        questions, 
        title
    }

}