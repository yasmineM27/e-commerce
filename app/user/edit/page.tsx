"use client";

import { useState, useEffect } from "react";
import { useRouter} from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(fd => ({
        ...fd,
        username: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  if (!user) return <p className="p-4">Loading…</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Update username/email
    updateProfile(formData.username, formData.email);

    // Update password if provided
    if (formData.currentPassword || formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
        setIsSaving(false);
        return;
      }
      const ok = updatePassword(formData.currentPassword, formData.newPassword);
      if (!ok) {
        toast({ title: "Error", description: "Current password is incorrect.", variant: "destructive" });
        setIsSaving(false);
        return;
      }
    }

    toast({ title: "Profile updated", description: "Your changes have been saved." });
    router.push("/");
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-black">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSaving}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSaving}
              required
              className="mt-1"
            />
          </div>

          <hr className="my-4 border-gray-300" />
          <p className="font-medium text-black">Change Password</p>

          <div>
            <Label htmlFor="currentPassword" className="text-black">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={isSaving}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-black">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isSaving}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-black">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSaving}
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full bg-black text-white hover:bg-gray-800">
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" className="w-full mt-2" onClick={() => router.back()}>
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
