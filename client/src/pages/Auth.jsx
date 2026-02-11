import React, { useState } from "react";
// import Background from "../assets/login2.png"; // Removed to use modern CSS background
import Victory from "../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

function Auth() {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      setIsLoadingLogin(true);

      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true },
      );

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoadingLogin(false);
    }
  };  

  const handleSignup = async () => {
    if (!validateSignup()) return;

    try {
      setIsLoadingSignup(true);

      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true },
      );

      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setIsLoadingSignup(false);
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#1b1c24] relative overflow-hidden">
      {/* Background Decor (Subtle) */}
      <div className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* Main Card */}
      <div className="relative z-10 h-[85vh] w-[90vw] md:w-[90vw] lg:w-[75vw] xl:w-[70vw] bg-[#2a2b2f]/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl grid xl:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE: FORM */}
        <div className="flex flex-col gap-8 items-center justify-center p-10 md:p-14 relative z-20">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Welcome
              </h1>
              <img
                src={Victory}
                alt="Victory"
                className="h-10 w-10 animate-bounce"
              />
            </div>
            <p className="font-medium text-white/60 max-w-xs text-sm">
              Fill in the details to get started with the best chat app!
            </p>
          </div>

          <div className="w-full max-w-sm">
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex justify-center mb-6">
                <div className="bg-[#1c1d25] p-1 rounded-full border border-white/10 flex w-full">
                  <TabsTrigger
                    value="login"
                    className="w-1/2 rounded-full data-[state=active]:bg-[#2f303b] data-[state=active]:text-white text-white/50 transition-all duration-300 py-2 text-sm"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="w-1/2 rounded-full data-[state=active]:bg-[#2f303b] data-[state=active]:text-white text-white/50 transition-all duration-300 py-2 text-sm"
                  >
                    Signup
                  </TabsTrigger>
                </div>
              </TabsList>

              <TabsContent className="flex flex-col gap-4" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-xl p-6 bg-[#1c1d25] border border-white/5 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-xl p-6 bg-[#1c1d25] border border-white/5 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  disabled={isLoadingLogin}
                  className="rounded-xl p-6 bg-linear-to-r from-[#8417ff] to-[#6d14d6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-900/20 text-md font-medium mt-4 flex items-center justify-center gap-2"
                  onClick={handleLogin}
                >
                  {isLoadingLogin ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-4" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-xl p-6 bg-[#1c1d25] border border-white/5 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-xl p-6 bg-[#1c1d25] border border-white/5 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-xl p-6 bg-[#1c1d25] border border-white/5 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  disabled={isLoadingSignup}
                  className="rounded-xl p-6 bg-linear-to-r from-[#8417ff] to-[#6d14d6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-900/20 text-md font-medium mt-4 flex items-center justify-center gap-2"
                  onClick={handleSignup}
                >
                  {isLoadingSignup ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating account...
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* RIGHT SIDE: MODERN ABSTRACT DESIGN */}
        <div className="hidden xl:flex flex-col justify-center items-center relative overflow-hidden bg-black">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-[#1c1d25] via-[#2a1b3d] to-[#1c1d25]"></div>

          {/* Glowing Orbs */}
          <div className="absolute top-[20%] right-[20%] w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-10 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <span className="text-4xl">💬</span>
            </div>

            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-purple-400">
              Connect. <br /> Collaborate. <br /> Create.
            </h2>

            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              Experience a seamless, secure, and modern way to communicate with
              your team and friends. Join the future of messaging today.
            </p>

            {/* Decorative Dots */}
            <div className="flex gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500/60 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500/30 animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
