import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return alert("Password cannot be empty");

    try {
      setLoading(true);

      // 🔹 Call your backend API here
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      }); 

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      // success (redirect to login page)
      alert("Password reset successful! Please login again.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your new password to reset the old one
          </p>
        </div>

        <div className="relative w-full">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="pl-10"
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none"/>
        </div>

        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange">
            Reset Password
          </Button>
        )}

        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-blue-500">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;
