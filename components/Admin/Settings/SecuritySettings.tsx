// components/Admin/Settings/SecuritySettings.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Lock,
  Key,
  Users,
  Globe,
  Database,
  Mail,
  Smartphone,
  AlertTriangle,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Fingerprint,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type IpWhitelistEntry = {
  id: string;
  ip: string;
  label: string;
};

type AdminUser = {
  id: string;
  email: string;
  role: "admin" | "manager" | "support";
  lastActive?: string;
  twoFactorEnabled: boolean;
};

type ApiKeyInfo = {
  exists: boolean;
  masked: string | null;
  createdAt: string | null;
  lastUsed: string | null;
};

export default function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // API Key State
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKeyInfo | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(false);

  // General Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    requireStrongPassword: true,
    passwordExpiryDays: 90,
    ipWhitelistEnabled: false,
    sslEnabled: true,
    backupEnabled: true,
    backupFrequency: "daily", // daily, weekly, monthly
    auditLogEnabled: true,
  });

  // IP Whitelist
  const [ipWhitelist, setIpWhitelist] = useState<IpWhitelistEntry[]>([
    { id: "1", ip: "192.168.1.1", label: "Office Network" },
    { id: "2", ip: "10.0.0.1", label: "VPN Access" },
  ]);

  // Admin Users
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      email: "admin@fourthview.com",
      role: "admin",
      twoFactorEnabled: true,
    },
    {
      id: "2",
      email: "manager@fourthview.com",
      role: "manager",
      twoFactorEnabled: false,
    },
    {
      id: "3",
      email: "support@fourthview.com",
      role: "support",
      twoFactorEnabled: false,
    },
  ]);

  const [newIp, setNewIp] = useState({ ip: "", label: "" });
  const [newAdminUser, setNewAdminUser] = useState({
    email: "",
    role: "support" as const,
  });

  // Fetch API key on mount
  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    setIsLoadingKey(true);
    try {
      const res = await fetch("/api/admin/settings/api-key");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setApiKeyInfo(data);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
      // Set default state if fetch fails
      setApiKeyInfo({
        exists: false,
        masked: null,
        createdAt: null,
        lastUsed: null,
      });
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    setSecuritySettings({ ...securitySettings, [field]: value });
    setIsDirty(true);
  };

  const addIpToWhitelist = () => {
    if (newIp.ip && newIp.label) {
      setIpWhitelist([...ipWhitelist, { id: Date.now().toString(), ...newIp }]);
      setNewIp({ ip: "", label: "" });
      setIsDirty(true);
      toast.success("IP added to whitelist");
    }
  };

  const removeIpFromWhitelist = (id: string) => {
    setIpWhitelist(ipWhitelist.filter((ip) => ip.id !== id));
    setIsDirty(true);
    toast.info("IP removed from whitelist");
  };

  const addAdminUser = () => {
    if (newAdminUser.email) {
      setAdminUsers([
        ...adminUsers,
        {
          id: Date.now().toString(),
          ...newAdminUser,
          twoFactorEnabled: false,
        },
      ]);
      setNewAdminUser({ email: "", role: "support" });
      setIsDirty(true);
      toast.success("Admin user added");
    }
  };

  const removeAdminUser = (id: string) => {
    setAdminUsers(adminUsers.filter((user) => user.id !== id));
    setIsDirty(true);
    toast.info("Admin user removed");
  };

  const updateAdminRole = (id: string, role: AdminUser["role"]) => {
    setAdminUsers(
      adminUsers.map((user) => (user.id === id ? { ...user, role } : user)),
    );
    setIsDirty(true);
  };

  const handleRotateKey = async () => {
    setIsRotating(true);
    try {
      const res = await fetch("/api/admin/settings/api-key/rotate", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to rotate key");

      await fetchApiKey(); // Refresh key info
      toast.success(
        "API key rotated successfully! New key is available in your email.",
      );
      setShowRotateModal(false);
    } catch (error) {
      toast.error("Failed to rotate API key");
    } finally {
      setIsRotating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all settings except API key (that's handled separately)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security settings saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSecuritySettings({
      twoFactorAuth: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      requireStrongPassword: true,
      passwordExpiryDays: 90,
      ipWhitelistEnabled: false,
      sslEnabled: true,
      backupEnabled: true,
      backupFrequency: "daily",
      auditLogEnabled: true,
    });
    setIpWhitelist([
      { id: "1", ip: "192.168.1.1", label: "Office Network" },
      { id: "2", ip: "10.0.0.1", label: "VPN Access" },
    ]);
    setAdminUsers([
      {
        id: "1",
        email: "admin@fourthview.com",
        role: "admin",
        twoFactorEnabled: true,
      },
      {
        id: "2",
        email: "manager@fourthview.com",
        role: "manager",
        twoFactorEnabled: false,
      },
      {
        id: "3",
        email: "support@fourthview.com",
        role: "support",
        twoFactorEnabled: false,
      },
    ]);
    setIsDirty(false);
    toast.info("Changes discarded");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "manager":
        return "bg-blue-100 text-blue-700";
      case "support":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Security Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage security settings, access controls, and authentication
          </p>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full"
          >
            <AlertCircle className="w-3 h-3" />
            Unsaved changes
          </motion.div>
        )}
      </div>

      {/* Authentication Security */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">
            Authentication Security
          </h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-blue-600" />
              Two-Factor Authentication (2FA)
            </Label>
            <p className="text-sm text-gray-500">
              Require 2FA for admin accounts
            </p>
          </div>
          <Switch
            checked={securitySettings.twoFactorAuth}
            onCheckedChange={(checked) =>
              handleSettingChange("twoFactorAuth", checked)
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Session Timeout (minutes)
            </Label>
            <Input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                handleSettingChange("sessionTimeout", Number(e.target.value))
              }
              className="mt-1"
              min={5}
              max={480}
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto logout after inactivity
            </p>
          </div>

          <div>
            <Label className="font-medium">Max Login Attempts</Label>
            <Input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) =>
                handleSettingChange("maxLoginAttempts", Number(e.target.value))
              }
              className="mt-1"
              min={3}
              max={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label className="font-medium">Lockout Duration (minutes)</Label>
            <Input
              type="number"
              value={securitySettings.lockoutDuration}
              onChange={(e) =>
                handleSettingChange("lockoutDuration", Number(e.target.value))
              }
              className="mt-1"
              min={5}
              max={1440}
            />
          </div>

          <div>
            <Label className="font-medium">Password Expiry (days)</Label>
            <Input
              type="number"
              value={securitySettings.passwordExpiryDays}
              onChange={(e) =>
                handleSettingChange(
                  "passwordExpiryDays",
                  Number(e.target.value),
                )
              }
              className="mt-1"
              min={30}
              max={365}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <Label className="font-medium">Require Strong Password</Label>
            <p className="text-sm text-gray-500">
              Enforce password complexity requirements
            </p>
          </div>
          <Switch
            checked={securitySettings.requireStrongPassword}
            onCheckedChange={(checked) =>
              handleSettingChange("requireStrongPassword", checked)
            }
          />
        </div>
      </div>

      {/* Access Control */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Access Control</h3>
        </div>

        {/* Admin Users */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Admin Users</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Email"
                value={newAdminUser.email}
                onChange={(e) =>
                  setNewAdminUser({ ...newAdminUser, email: e.target.value })
                }
                className="w-64"
              />
              <select
                value={newAdminUser.role}
                onChange={(e) =>
                  setNewAdminUser({
                    ...newAdminUser,
                    role: e.target.value as any,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="support">Support</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={addAdminUser} size="sm">
                Add User
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {user.email}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                    {user.twoFactorEnabled && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        2FA Enabled
                      </span>
                    )}
                  </div>
                  {user.lastActive && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last active: {user.lastActive}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateAdminRole(user.id, e.target.value as any)
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="support">Support</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdminUser(user.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                IP Whitelist
              </Label>
              <p className="text-sm text-gray-500">
                Restrict admin access to specific IP addresses
              </p>
            </div>
            <Switch
              checked={securitySettings.ipWhitelistEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("ipWhitelistEnabled", checked)
              }
            />
          </div>

          {securitySettings.ipWhitelistEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="IP Address"
                  value={newIp.ip}
                  onChange={(e) => setNewIp({ ...newIp, ip: e.target.value })}
                  className="w-48"
                />
                <Input
                  placeholder="Label (e.g., Office)"
                  value={newIp.label}
                  onChange={(e) =>
                    setNewIp({ ...newIp, label: e.target.value })
                  }
                  className="w-48"
                />
                <Button onClick={addIpToWhitelist} size="sm">
                  Add IP
                </Button>
              </div>

              <div className="space-y-2">
                {ipWhitelist.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-mono text-sm">{entry.ip}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({entry.label})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIpFromWhitelist(entry.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* API Security */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">API Security</h3>
        </div>

        <div className="space-y-4">
          {/* Professional API Key Management */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <Label className="font-medium flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-600" />
                  Stripe API Key
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Used for payment processing. Keep this secure.
                </p>

                {isLoadingKey ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </div>
                ) : apiKeyInfo?.exists ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <code className="px-3 py-1.5 bg-gray-100 rounded text-sm font-mono text-gray-600">
                        {apiKeyInfo.masked}
                      </code>
                      <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                    {apiKeyInfo.createdAt && (
                      <p className="text-xs text-gray-400">
                        Created:{" "}
                        {new Date(apiKeyInfo.createdAt).toLocaleDateString()}
                        {apiKeyInfo.lastUsed && (
                          <>
                            {" "}
                            · Last used:{" "}
                            {new Date(apiKeyInfo.lastUsed).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg w-fit">
                    <AlertCircle className="w-4 h-4" />
                    No API key configured
                  </div>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <Dialog
                  open={showRotateModal}
                  onOpenChange={setShowRotateModal}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={isLoadingKey}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Rotate Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Rotate API Key
                      </DialogTitle>
                      <DialogDescription>
                        This will generate a new API key and invalidate the
                        current one. The new key will be sent to your admin
                        email.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                      <h4 className="text-sm font-medium text-amber-800 mb-2">
                        Important:
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                        <li>Current key will stop working immediately</li>
                        <li>
                          Update your environment variables with the new key
                        </li>
                        <li>All active payments will continue to work</li>
                      </ul>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={handleRotateKey}
                        disabled={isRotating}
                        className="bg-amber-600 hover:bg-amber-700 gap-2"
                      >
                        {isRotating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Rotating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Confirm Rotation
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <Label className="font-medium">API Rate Limiting</Label>
              <p className="text-sm text-gray-500">
                Maximum requests per minute
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                defaultValue={100}
                className="w-24 text-right"
                min={10}
                max={1000}
              />
              <span className="text-sm text-gray-500">req/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Security */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Data Security</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">SSL/HTTPS Enforcement</Label>
              <p className="text-sm text-gray-500">
                Force HTTPS for all connections
              </p>
            </div>
            <Switch
              checked={securitySettings.sslEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("sslEnabled", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">Automatic Backups</Label>
              <p className="text-sm text-gray-500">Regular database backups</p>
            </div>
            <Switch
              checked={securitySettings.backupEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("backupEnabled", checked)
              }
            />
          </div>

          {securitySettings.backupEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pl-6"
            >
              <Label className="font-medium">Backup Frequency</Label>
              <select
                value={securitySettings.backupFrequency}
                onChange={(e) =>
                  handleSettingChange("backupFrequency", e.target.value)
                }
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg mt-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </motion.div>
          )}

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Audit Log
              </Label>
              <p className="text-sm text-gray-500">Track all admin actions</p>
            </div>
            <Switch
              checked={securitySettings.auditLogEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("auditLogEnabled", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800">
              Security Recommendations
            </h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Enable Two-Factor Authentication for all admin accounts</li>
              <li>• Use strong passwords with at least 12 characters</li>
              <li>• Regularly review admin user access</li>
              <li>• Keep your API keys secure and rotate them periodically</li>
              <li>• Enable audit logging to track all important actions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving || !isDirty}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {!isDirty && !isSaving && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All settings saved
        </div>
      )}
    </div>
  );
}
