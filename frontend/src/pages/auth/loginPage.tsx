import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from '../../assets/logo.png';
import { useLogin } from '@/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/schemas';

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate('/');
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Avatar className="size-4">
              <AvatarImage src={logo} />
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
          Soleil Stock
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Bienvenue</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input type="email" {...register('email')} placeholder="m@example.com"  />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Mot de Passe</FieldLabel>
                      {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Mot de passe oublier ?
                      </a> */}
                    </div>
                    <Input type="password" {...register('password')}  />
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    {loginMutation.isError && (
                      <p className="mt-2 text-sm text-red-600">Identifiants incorrects</p>
                    )}
                    <FieldDescription className="text-center">
                      {/* Don&apos;t have an account? <a href="#">Sign up</a> */}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { LoginPage };
