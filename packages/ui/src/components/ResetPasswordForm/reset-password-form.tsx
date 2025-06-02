"use client";
import Link from "next/link";
import { usePasswordResetStore } from "@amurex/ui/store";
import { Input } from "@amurex/ui/components";

export const ResetPasswordForm = () => {
  const { email, loading, message, setEmail, handleSendResetEmail } =
    usePasswordResetStore();

  return (
    <div className="w-full rounded-lg bg-[#0E0F0F] p-6 md:p-8 backdrop-blur-sm shadow-lg">
      <div className="text-center mb-6 md:mb-8">
        <h1
          className="font-serif text-3xl md:text-4xl mb-2 text-white"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
          Reset Password
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Enter your email to receive reset instructions
        </p>
      </div>

      <hr className="mb-6 border-gray-800" />

      <form onSubmit={handleSendResetEmail} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium font-semibold text-white mb-1">
            Email
          </label>
          <Input
            className="w-full py-3 md:py-4 px-3 bg-[#262727] text-white border border-[#262727] text-sm md:text-base"
            type="email"
            value={email}
            placeholder="Enter your email"
            props={{
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value),
            }}
          />
        </div>

        {message && (
          <p
            className={`text-xs md:text-sm ${
              message.includes("error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-[#0E0F0F] p-2.5 md:p-3 text-sm md:text-base font-semibold rounded-lg hover:bg-[#0E0F0F] hover:text-white hover:border-white border border-[#0E0F0F] transition-all duration-200"
        >
          {loading ? "Sending..." : "Send Reset Instructions"}
        </button>
      </form>

      <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-400">
        Remember your password?{" "}
        <Link href="/signin" className="text-white font-light hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
