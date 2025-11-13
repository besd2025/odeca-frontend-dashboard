import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "../toggle-theme-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/login-images/img1.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </div>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 relative">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Se connecter</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte{" "}
                  <span className="font-bold text-primary text-lg">
                    Agricole Burundi
                  </span>
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>
                  Email ou mot de passe incorrect.
                </AlertDescription>
              </Alert>
              <Field>
                <Button type="submit">Se connecter</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/login-images/img1.jpg"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.7]"
            />
          </div>
          <ModeToggle className="absolute top-4 right-4" />
        </CardContent>
      </Card>
    </div>
  );
}
