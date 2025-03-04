
// Re-export all friend service functions from their respective modules
export { fetchFriendsList } from './friendsCore';
export { blockUserInDb, removeFriendFromDb, addFriendToDb } from './friendManagement';
export { acceptFriendRequest, declineFriendRequest } from './friendRequests';
export { subscribeToFriendRequests, showFriendRequestNotification } from './friendNotifications';
