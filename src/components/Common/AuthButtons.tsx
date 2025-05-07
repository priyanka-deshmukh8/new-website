import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div>
      {!user ? (
        <Link href="/api/auth/login">
          <a>Login</a>
        </Link>
      ) : (
        <Link href="/api/auth/logout">
          <a>Logout</a>
        </Link>
      )}
    </div>
  );
};

export default AuthButtons; 