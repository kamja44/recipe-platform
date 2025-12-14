import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "../ui/input";
import { forwardRef, useState } from "react";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className="pl-10 pr-10"
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
