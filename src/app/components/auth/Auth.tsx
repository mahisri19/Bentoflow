import { useState } from "react";
import { Heart } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from "../../../lib/supabase";

type AuthView = "login" | "register" | "confirmation";

// Move components outside to avoid re-mounting on every render
const WelcomeAnimation = () => (
    <div className="w-full max-w-[500px] aspect-square flex items-center justify-center">
        <DotLottieReact
            src="https://lottie.host/56ff0290-8c30-4f35-8ac0-c902d07f4813/Yc93Dy7V1j.lottie"
            loop
            autoplay
        />
    </div>
);

const InputField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name
}: {
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}) => (
    <div className="flex flex-col gap-2 w-full">
        <label className="text-white/80 text-sm font-medium ml-1">{label}</label>
        <input
            name={name}
            type={type}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default function Auth() {
    const [view, setView] = useState<AuthView>("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !name) {
            setError("Please fill in all details");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: window.location.origin,
            },
        });
        console.log("Supabase SignUp Response:", { data, error });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setView("confirmation");
        }
    };

    // LOGIN VIEW
    if (view === "login") {
        return (
            <div className="flex w-full h-full bg-[#0a0a16] relative overflow-hidden overflow-y-auto">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full" />

                <div className="flex flex-col md:flex-row w-full max-w-[1200px] mx-auto h-full relative z-10">
                    {/* Left Side - Illustration */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
                        <h1 className="text-5xl md:text-7xl font-bold font-['Playfair_Display'] text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white/80 mb-4 drop-shadow-lg text-center md:text-left">Bento Flow</h1>
                        <WelcomeAnimation />
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
                        <div className="w-full max-w-md flex flex-col items-center">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-white mb-8 flex items-center gap-3">
                                Welcome <Heart className="fill-red-500 text-red-500 w-6 h-6 md:w-8 md:h-8" />
                            </h2>

                            <div className="w-full space-y-6">
                                <InputField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <InputField
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {error && <div className="text-red-400 text-sm text-center">{error}</div>}

                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-full bg-[#702459] hover:bg-[#852b6b] disabled:bg-[#702459]/50 text-white py-3 rounded-xl font-medium transition-colors mt-8 shadow-lg shadow-purple-900/20 flex justify-center"
                                >
                                    {loading ? "Sign in..." : "Sign in"}
                                </button>

                                <p className="text-center text-white/60 mt-6 text-sm">
                                    New User? <button onClick={() => setView("register")} className="text-[#d84093] hover:text-[#f05bb0] font-medium ml-1">Register</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // REGISTER VIEW
    if (view === "register") {
        return (
            <div className="flex w-full h-full bg-[#0a0a16] relative overflow-hidden overflow-y-auto items-center justify-center p-4">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full" />

                <div className="bg-[#0f0f1a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 w-full max-w-4xl relative z-10 shadow-2xl my-auto">
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                        <button onClick={() => setView("login")} className="text-white/40 font-medium hover:text-white transition-colors">← Login</button>
                        <div className="text-white/40 font-medium">Register</div>
                    </div>

                    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-white mb-2 flex items-center gap-3">
                            Welcome <Heart className="fill-red-500 text-red-500 w-6 h-6 md:w-8 md:h-8" />
                        </h2>
                        <p className="text-white/60 mb-8 md:mb-10 text-center">Kindly fill your details</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6 w-full">
                            <InputField
                                label="Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <InputField
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputField
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && <div className="text-red-400 text-sm mt-4 text-center">{error}</div>}

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full md:w-auto px-12 bg-[#702459] hover:bg-[#852b6b] disabled:bg-[#702459]/50 text-white py-3 rounded-xl font-medium transition-colors mt-8 md:mt-12 shadow-lg shadow-purple-900/20"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // CONFIRMATION VIEW
    if (view === "confirmation") {
        return (
            <div className="flex w-full h-full bg-[#0a0a16] relative overflow-hidden items-center justify-center p-8">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full" />

                <div className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-blue-500/30 rounded-none w-full max-w-4xl h-[600px] relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />

                    <div className="p-8 text-blue-400/60 font-medium">Login/register</div>

                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <h2 className="text-4xl leading-tight font-medium text-white mb-12 max-w-2xl">
                            Kindly confirm your registration by<br />
                            clicking on the link sent to your inbox
                        </h2>

                        <button
                            onClick={() => setView("login")}
                            className="px-12 bg-[#702459] hover:bg-[#852b6b] text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-purple-900/20"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
