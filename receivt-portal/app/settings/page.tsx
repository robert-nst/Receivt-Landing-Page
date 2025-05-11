"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("sk_test_51Hb9***************************")
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title={t("settings")} description={t("settings.description")} />

      <div className="p-6 pt-0">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t("settings.profile")}</TabsTrigger>
            <TabsTrigger value="integrations">{t("settings.integrations")}</TabsTrigger>
            <TabsTrigger value="users">{t("settings.users")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.businessInfo")}</CardTitle>
                  <CardDescription>{t("settings.businessInfoDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">{t("settings.businessName")}</Label>
                      <Input id="business-name" defaultValue="Acme Corporation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email">{t("settings.businessEmail")}</Label>
                      <Input id="business-email" type="email" defaultValue="contact@acme.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">{t("settings.businessPhone")}</Label>
                      <Input id="business-phone" type="tel" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-website">{t("settings.website")}</Label>
                      <Input id="business-website" type="url" defaultValue="https://acme.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-address">{t("settings.businessAddress")}</Label>
                    <Textarea id="business-address" defaultValue="123 Main Street, Suite 101&#10;Anytown, CA 12345" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-description">{t("settings.businessDescription")}</Label>
                    <Textarea
                      id="business-description"
                      defaultValue="Acme Corporation is a leading provider of innovative solutions for businesses of all sizes."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">{t("settings.cancel")}</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">{t("settings.saveChanges")}</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>Customize your loyalty program branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="program-name">Loyalty Program Name</Label>
                    <Input id="program-name" defaultValue="Acme Rewards" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                        <Button variant="outline" size="sm">
                          Change Logo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Brand Colors</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full bg-secondary" />
                          <span className="text-sm">#083118</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setApiKey("sk_test_51Hb9***************************")}
                      >
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This key allows access to your Receivt data via the API. Keep it secure.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage your connected third-party services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Facebook</h3>
                          <p className="text-sm text-muted-foreground">Connected on May 12, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.8 2h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 4.28 21 5.12 21 6.8v10.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 22 17.88 22 16.2 22H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 19.72 3 18.88 3 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 2 6.12 2 7.8 2Z" />
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h8M8 14h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Shopify</h3>
                          <p className="text-sm text-muted-foreground">Connected on June 3, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Connect a new service</h3>
                          <p className="text-sm text-muted-foreground">Add integration with other platforms</p>
                        </div>
                      </div>
                      <Button className="bg-secondary hover:bg-secondary/90" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team members and their access</CardDescription>
                  </div>
                  <Button className="bg-secondary hover:bg-secondary/90">Invite User</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            JD
                          </div>
                          <div>
                            <h3 className="font-medium">John Doe</h3>
                            <p className="text-sm text-muted-foreground">john.doe@acme.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Admin
                          </span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            JS
                          </div>
                          <div>
                            <h3 className="font-medium">Jane Smith</h3>
                            <p className="text-sm text-muted-foreground">jane.smith@acme.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Manager
                          </span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            RW
                          </div>
                          <div>
                            <h3 className="font-medium">Robert Wilson</h3>
                            <p className="text-sm text-muted-foreground">robert.wilson@acme.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Viewer
                          </span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Configure access levels for different user roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Admin</h3>
                    <p className="text-sm text-muted-foreground mb-2">Full access to all features and settings</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked disabled />
                        <span className="text-sm">View Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked disabled />
                        <span className="text-sm">Manage Customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked disabled />
                        <span className="text-sm">Manage Loyalty Program</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked disabled />
                        <span className="text-sm">Manage Users</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Manager</h3>
                    <p className="text-sm text-muted-foreground mb-2">Access to manage customers and loyalty program</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span className="text-sm">View Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span className="text-sm">Manage Customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span className="text-sm">Manage Loyalty Program</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        <span className="text-sm">Manage Users</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Viewer</h3>
                    <p className="text-sm text-muted-foreground mb-2">Read-only access to dashboard and data</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span className="text-sm">View Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        <span className="text-sm">Manage Customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        <span className="text-sm">Manage Loyalty Program</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        <span className="text-sm">Manage Users</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-secondary hover:bg-secondary/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Configure which email notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Daily Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive a daily summary of your business activity
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Customer Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a new customer joins your loyalty program
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Campaign Performance</h3>
                        <p className="text-sm text-muted-foreground">Receive updates on your campaign performance</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">System Updates</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified about system updates and maintenance
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Default</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">Save Preferences</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Recipients</CardTitle>
                  <CardDescription>Configure who receives notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-email">Primary Email</Label>
                    <Input id="primary-email" type="email" defaultValue="admin@acme.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cc-emails">CC Emails</Label>
                    <Input id="cc-emails" type="text" defaultValue="manager@acme.com, support@acme.com" />
                    <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-secondary hover:bg-secondary/90">Save Recipients</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
