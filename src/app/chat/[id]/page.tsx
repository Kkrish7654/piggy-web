import ViewChat from '@/components/Chats/ViewChat'
import React from 'react'

const page = ({params}: {params: {id: string}}) => {
  return (
    <ViewChat roomId={params.id}/>
  )
}

export default page