import { useState } from "react";
import { LogIn, UserPlus, Phone, Facebook } from "lucide-react";
import { User } from "@/types";
import { CAMPUS_OPTIONS } from "@/data/products";
import { getUsers, saveUsers, findUser, setAuthedUser } from "@/utils/storage";
import { TextInput } from "@/components/ui/text-input";
import { SelectInput } from "@/components/ui/select-input";
import { StoreButton } from "@/components/ui/store-button";

interface AuthViewProps {
  onAuthed: (user: User) => void;
}

export function AuthView({ onAuthed }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [facebook, setFacebook] = useState("");
  const [campus, setCampus] = useState("CAS Department");
  const [error, setError] = useState("");

  function reset() {
    setPassword("");
    setError("");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const user = findUser(username || "");
    if (!user) return setError("User not found. Please sign up.");
    if (user.password !== password) return setError("Incorrect password.");
    setAuthedUser(user.username);
    onAuthed(user);
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const existing = findUser(username || "");
    if (existing) return setError("Username already exists.");
    if (!/^[0-9]{10,13}$/.test(contact)) return setError("Contact number must be 10-13 digits.");
    
    const user: User = { username, password, contact, facebook, campus };
    const users = getUsers();
    users.push(user);
    saveUsers(users);
    setAuthedUser(username);
    onAuthed(user);
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 bg-gradient-hero">
      <div className="w-full max-w-md bg-background rounded-3xl shadow-card p-8 border border-border">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🥛</span>
            <div>
              <h2 className="text-2xl font-bold text-brand-gradient">Soy Fresh</h2>
              <p className="text-muted-foreground text-sm">Campus Soy Milk Delivery</p>
            </div>
          </div>
          <p className="text-foreground">
            Sign {mode === "login" ? "in" : "up"} to start ordering
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-destructive/10 text-destructive text-sm px-4 py-3 border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex mb-6 rounded-2xl bg-secondary p-1 border border-border">
          <button 
            onClick={() => { setMode("login"); reset(); }} 
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === "login" 
                ? "bg-background shadow-soft text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
          <button 
            onClick={() => { setMode("signup"); reset(); }} 
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === "signup" 
                ? "bg-background shadow-soft text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </button>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-1">
          <TextInput 
            label="Username" 
            value={username} 
            onChange={setUsername} 
            placeholder="e.g. soylover" 
            required
          />
          <TextInput 
            label="Password" 
            type="password" 
            value={password} 
            onChange={setPassword} 
            placeholder="••••••••" 
            required
          />

          {mode === "signup" && (
            <>
              <TextInput 
                label="Contact Number (SMS)" 
                icon={Phone} 
                value={contact} 
                onChange={setContact} 
                placeholder="09xxxxxxxxx" 
                required
              />
              <TextInput 
                label="Facebook Account" 
                icon={Facebook} 
                value={facebook} 
                onChange={setFacebook} 
                placeholder="facebook.com/yourprofile" 
              />
              <SelectInput 
                label="Campus Location" 
                value={campus} 
                onChange={setCampus} 
                options={CAMPUS_OPTIONS} 
              />
              <p className="text-xs text-muted-foreground mb-4 p-3 rounded-xl bg-accent/50">
                We only use your info to coordinate campus pickup/delivery. (Demo only; not real authentication.)
              </p>
            </>
          )}

          <div className="pt-2">
            <StoreButton 
              type="submit" 
              icon={mode === "login" ? LogIn : UserPlus} 
              variant="hero"
              className="w-full"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </StoreButton>
          </div>
        </form>

        {mode === "login" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <button 
              className="text-primary hover:text-primary-light font-medium underline transition-colors" 
              onClick={() => setMode("signup")}
            >
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}