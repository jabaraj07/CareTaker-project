import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import  LoadingPage  from '../../pages/LoadingPage';


interface Props {
  children: React.ReactNode;
}

export function PublicOnlyRoute({ children }: Props) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
