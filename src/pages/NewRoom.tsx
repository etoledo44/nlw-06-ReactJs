import { Link, useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/authContext'
import { FormEvent, useState } from 'react'
import {database} from '../services/firebase'
 

export function NewRoom(){
    const {user} = useAuth()
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault()
        console.log(newRoom)

        if(newRoom.trim() === ''){
            // trim remove os espaços da variavel
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,

        })
        console.log(firebaseRoom);
        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração" />
                <strong>Crie sala de Q&amp;A ao-vivo</strong>
                <p>Tire as duvidas de sua audiencia em temo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <strong>Olá {user?.name || 'Forasteiro'}!</strong>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value) }
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form >
                    <p>
                        Quer entrar em uma sala existe? <Link to="/">Clique aqui!</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}