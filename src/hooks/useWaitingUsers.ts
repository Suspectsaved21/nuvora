import { useState } from 'react';

export interface WaitingUser {
  id: string;
  peer_id: string;
  is_available: boolean;
  inserted_at: string;
}

export function useWaitingUsers(ownPeerId: string) {
  const [waitingUsers, setWaitingUsers] = useState<WaitingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  return { waitingUsers, isLoading, error };
}
