import { AuthLayout } from '../components/layout/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up medication tracking in minutes"
    >
      <SignupForm />
    </AuthLayout>
  );
}