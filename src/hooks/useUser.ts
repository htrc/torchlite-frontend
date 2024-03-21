// next
import { useSession } from 'next-auth/react';

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
}

const useUser = () => {
  const { data: session } = useSession();
  if (session) {
    const user = session?.user;
    let thumb = user?.image!;

    if (!user?.image) {
      user!.image = '/assets/images/users/avatar-1.png';
      thumb = '/assets/images/users/avatar-thumb-1.png';
    }

    const newUser: UserProps = {
      name: user!.name!,
      email: user!.email!,
      avatar: user?.image!,
      thumb,
      role: ''
    };

    return newUser;
  }
  return false;
};

export default useUser;
