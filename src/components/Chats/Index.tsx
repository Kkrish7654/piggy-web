"use client"
import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, IconButton } from '@mui/material';
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
    socketService.listenAvailableRooms((room) => {
      setRooms(room)
    })

  },[open])

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
        Room List
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
                socketService.listenAvailableRooms((room) => {
                  setRooms(room)
                })
            }}
            sx={{
                width: '100%',
                bgcolor: 'primary.main',
                color: 'white',
            }}  
            disabled={!roomName}
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
                        <Box sx={{
                          display:"flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body1"
                                color="text.primary"
                                onClick={() => {setRoomId(room.roomId)
                                  setOpen(true)
                                }
                                  
                                }
                                >
                                {room.roomName}
                            </Typography> 
                            <IconButton 
                              onClick={() => {
                                socketService.deleteRoom(room.roomId)
                                socketService.listenAvailableRooms((room) => {
                                  setRooms(room)
                                })
                              }}
                            >
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                            </IconButton>
                        </Box>
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
