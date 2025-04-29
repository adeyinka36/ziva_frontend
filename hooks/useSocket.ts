// useSocket.ts
import { useEffect, useState } from 'react';
import { SOCKET_URL } from '@/utils/getUrls';
import io from 'socket.io-client';

let socketInstance: any = null; // Module-level variable

const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Create the socket only if it doesn't already exist.
    if (!socketInstance) {
      socketInstance = io(`${SOCKET_URL}:3000`);
    } 
    setSocket(socketInstance);


  }, []);

  return socket;
};

export default useSocket;
