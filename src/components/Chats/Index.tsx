"use client"
import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle } from '@mui/material';
import socketService from '@/utils/socketServer';
import Link from 'next/link';

const Chats: React.FC = () => {
  const [rooms, setRooms] = React.useState<{roomId: string, roomName: string}[]>([]);
  const [roomName, setRoomName] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const [roomId, setRoomId] = React.useState<string>('');

  useEffect(() => {
    socketService.initalizeSocket();
  },[])

  useEffect(() => {
    socketService.listenForRoomUpdate((room) => {
       const r = [...rooms]
       setRooms(r.concat(room))
    })
  },[rooms])

  return (
    <Box 
      sx={{
        width: '100%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 2,
        }}
      >
        Chat List
      </Typography>


        <TextField 
            label="Room Name"
            variant="outlined"
            sx={{width: '100%'}}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
        />


        <Button
            variant="contained"
            onClick={() => {
                socketService.createRoom(roomName)
                setRoomName('')
            }}
            sx={{
                width: '100%',
                bgcolor: 'primary.main',
                color: 'white',
            }}  
        >
            Create Room
        </Button>

      <List>
        {
            rooms?.map((room) => (
                <ListItem
                key={room.roomId}
                alignItems="flex-start"
                sx={{
                    '&:hover': {
                    bgcolor: 'action.hover',
                    },
                }}
                >

                <ListItemText
                    primary={
                        <>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body1"
                                color="text.primary"
                                onClick={() => {setRoomId(room.roomId)
                                  setOpen(true)}
                                }
                                >
                                {room.roomName}
                            </Typography> 
                        </>
                    }/>

                </ListItem>

               
            ))
            
        }
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Join Room</DialogTitle>
              <TextField 
                  label="Name"
                  variant="outlined"
                  sx={{width: '100%'}}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
              />
              <Link href={`/chat/${roomId}?user=${userName}`}>
                  <Button>Join</Button>
              </Link>
        </Dialog>

      {/* <List>
        {chatData.map((chat) => (
          <React.Fragment key={chat.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={chat.avatar} alt={chat.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                    <>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body1"
                            color="text.primary"
                        >
                            {chat.name}
                        </Typography>
                    </>
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {chat.message}
                    </Typography>
                    {' — ' + chat.time}
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List> */}
    </Box>
  );
};

export default Chats;
