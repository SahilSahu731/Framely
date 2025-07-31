import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Outlet /> {/* Renders Login or Signup page */}
    </div>
  );
};

export default AuthLayout;