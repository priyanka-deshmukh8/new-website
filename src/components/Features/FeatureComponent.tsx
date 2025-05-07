import { useUser } from '@auth0/nextjs-auth0/client';

const FeatureComponent = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user ? <p>Welcome, {user.name}</p> : <p>Please log in</p>}
    </div>
  );
};

export default FeatureComponent; 