import { useUser } from '../hooks/useUser';

export const UserProfile = ({ userId }: { userId: string }) => {
  const { user, isLoading, error, fetchUser } = useUser();

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};