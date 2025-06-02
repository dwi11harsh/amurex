import { supabase } from "@amurex/ui/lib/supabaseClient";
import { create } from "zustand";
import { PasswordResetState, PasswordResetActions } from "@amurex/ui/types";

export const usePasswordResetStore = create<
  PasswordResetState & PasswordResetActions
>((set, get) => ({
  email: "",
  loading: false,
  message: "",

  setEmail: (email) => set({ email }),
  setLoading: (loading) => set({ loading }),
  setMessage: (message) => set({ message }),

  handleSendResetEmail: async (e) => {
    e.preventDefault();
    set({ loading: true, message: "" });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(get().email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        set({ message: error.message });
      } else {
        set({ message: "Check your email for the password reset link!" });
      }
    } catch (error) {
      set({ message: "An unexpected error occurred" });
    } finally {
      set({ loading: false });
    }
  },
}));
