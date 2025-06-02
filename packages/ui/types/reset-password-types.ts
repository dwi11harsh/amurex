import React from "react";
export interface PasswordResetState {
  email: string;
  loading: boolean;
  message: string;
}

export type PasswordResetActions = {
  setEmail: (email: string) => void;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string) => void;
  handleSendResetEmail: (e: React.FormEvent) => Promise<void>;
};
