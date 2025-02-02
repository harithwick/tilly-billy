"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { AlertTriangle, Mail, Github } from "lucide-react";
import { GoogleIcon } from "@/lib/constants/custom-icons";
import { Alert, AlertDescription } from "@/lib/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { HTMLAttributes } from "react";
import { plans } from "@/lib/constants/pricing-plans";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [authMethods, setAuthMethods] = useState<{
    email?: boolean;
    google?: boolean;
    github?: boolean;
  }>({});
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL or default to 'profile'
  const defaultTab = searchParams.get("tab") || "profile";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        form.reset(data);

        // Get auth methods and subscription
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const methods: typeof authMethods = {};

          // Check for email/password
          if (user.email) {
            methods.email = true;
          }

          // Check for OAuth providers
          console.log(user.identities);
          user.identities?.forEach((identity) => {
            if (identity.provider === "google") methods.google = true;
            if (identity.provider === "github") methods.github = true;
          });

          setAuthMethods(methods);

          // Get subscription from user metadata
          const subscription = user.user_metadata?.currentSubscription || null;
          setCurrentSubscription(subscription);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    }

    loadProfile();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const updateData = {
        fullName: values.fullName,
        email: values.email,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "delete my account") return;

    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await supabase.auth.signOut();
      router.push("/");
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="py-12 px-4 max-w-screen-lg mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your personal information.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Connected Accounts</h3>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {authMethods.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>Email/Password</span>
                        </div>
                      )}
                      {authMethods.google && (
                        <div className="flex items-center gap-2 text-sm">
                          <GoogleIcon />
                          <span>Google</span>
                        </div>
                      )}
                      {authMethods.github && (
                        <div className="flex items-center gap-2 text-sm">
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                View and manage your subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Current Plan</h3>
                  <p className="text-2xl font-bold capitalize">
                    {currentSubscription || "Free"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentSubscription
                      ? `You are currently on the ${currentSubscription} plan.`
                      : "You are currently on the free plan."}
                  </p>
                </div>

                {currentSubscription && (
                  <div className="flex flex-col space-y-2">
                    <Button asChild>
                      <a
                        href="https://billing.stripe.com/p/login/test_28o5kq7Ol8Qf3GE288"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Manage Plan
                      </a>
                    </Button>
                  </div>
                )}

                {!currentSubscription && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Available Plans</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {plans
                        .filter((plan) => plan.name !== "Free")
                        .map((plan) => (
                          <Card key={plan.id} className="flex flex-col">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                {plan.name}
                                {plan.nameBadge && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {plan.nameBadge}
                                  </span>
                                )}
                              </CardTitle>
                              <CardDescription>
                                {plan.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="border-t pt-4 space-y-2">
                              <Button
                                className="w-full"
                                variant="outline"
                                asChild
                              >
                                <a
                                  href="/pricing"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Features
                                </a>
                              </Button>
                              <Button className="w-full">
                                Upgrade to {plan.name}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all associated data from our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please type{" "}
              <span className="font-semibold">delete my account</span> to
              confirm
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete my account"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={confirmText !== "delete my account" || loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
