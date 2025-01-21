"use client"

import socketService from '@/utils/socketServer'
import { Box, Button,TextField, Typography } from '@mui/material'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ViewChat = ({roomId}: {roomId: string}) => {

    const searchParams = useSearchParams()
 
    const user = searchParams.get('user')

    const [person, setPerson] = React.useState<{ roomId: string; user: string }[]>([])

    const [message, setMessage] = React.useState<string>('')

    const [userMessage, setUserMessage] = React.useState<{
        roomId: string;
        userName: string;
        message: string;
    }>({
        roomId: '',
        userName: '',
        message
    })

    const [groupMessages, setGroupMessages] = React.useState< {
        roomId: string;
        userId: string;
        message: string;
    }[]>([])


    const router = useRouter()
    const pathName = usePathname()
    const prevPathName = useRef(pathName)


    useEffect(() => {
        socketService.joinRoom({
            roomId: roomId as string,
            user: user as string
        }) 

        socketService.joinRoomMessage((message) => {
            setMessage(message)
        })

        socketService.peopleInRoom((people) => {
            setPerson(people)
        })

        socketService.newPeopleInRoom((message) => {
            toast.success(message)
        })

    },[roomId, user])


    useEffect(() => {
        return () => {
            socketService.leaveRoom(roomId, user || "")
        }
    },[])

    useEffect(() => {
        if (prevPathName.current !== pathName) {
          if (prevPathName.current === `/chat/${roomId}`) {
            socketService.leaveRoom(roomId, user || '');
          }
          prevPathName.current = pathName;
        }

        socketService.peopleInRoom((people) => {
            setPerson(people)
        })
    }, [pathName, roomId, user]);
    


    function sendMessage() {
        if (userMessage.message.trim() !== "") {
            socketService.newMessage(userMessage);
            setUserMessage({
                roomId: roomId as string,
                userName: user as string,
                message: "", 
            });
        }
    }

    useEffect(() => {
        socketService.listenForNewMessage((msg) => {
            setGroupMessages((prevMessages) => [...prevMessages, msg])
        })
    },[])


    useEffect(() => {
        socketService.redirectAfterRoomDelete(router)
    },[router])

    return (
       <Box>

            <Toaster/>

            <Typography sx={{
                fontSize: 12
            }} variant="body1">
                {message}
            </Typography>

            <Typography
            sx={{
                fontSize: 12
            }}
            variant="body1">
                Peoples: {person.length}
            </Typography>

            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 800,
                margin: "auto",
                padding: 2,
            }}
            >
            {/* Header */}
            <Typography variant="h6" textAlign="center">
                Group Chat
            </Typography>


            {/* Chat Room */}
                <Box
                sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
                >
                {/* Chat Messages */}
                    <Box
                        sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        padding: 2,
                        height: 300,
                        overflowY: "auto",
                        }}
                    >
                        {groupMessages?.map((msg, index) => (
                        <Typography key={index} variant="body2">
                            <strong>{msg.userId}:</strong> {msg.message}
                        </Typography>
                        ))}
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                        label="Type a message"
                        variant="outlined"
                        fullWidth
                        value={userMessage.message}
                        onChange={(e) => setUserMessage({
                            roomId: roomId as string,
                            userName: user as string,
                            message: e.target.value
                        })}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button variant="contained" onClick={sendMessage}>
                            Send
                        </Button>
                    </Box>
            </Box>
        
        </Box>

       </Box>
    )
}

export default ViewChat