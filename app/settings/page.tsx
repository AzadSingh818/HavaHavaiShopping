"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Eye } from "lucide-react"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)

  // Privacy settings
  const [shareData, setShareData] = useState(false)
  const [saveHistory, setSaveHistory] = useState(true)

  // Appearance settings
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router])

  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!isAuthenticated || loading) {
    return null
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {success && (
          <div className="p-3 text-sm text-white bg-green-500 rounded mb-4">Settings saved successfully!</div>
        )}

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-6">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-updates" className="font-medium">
                      Order Updates
                    </Label>
                    <p className="text-sm text-gray-500">Get notified about your order status</p>
                  </div>
                  <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions" className="font-medium">
                      Promotions and Offers
                    </Label>
                    <p className="text-sm text-gray-500">Receive updates about deals and special offers</p>
                  </div>
                  <Switch id="promotions" checked={promotions} onCheckedChange={setPromotions} />
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-data" className="font-medium">
                      Data Sharing
                    </Label>
                    <p className="text-sm text-gray-500">Allow us to share anonymized data with partners</p>
                  </div>
                  <Switch id="share-data" checked={shareData} onCheckedChange={setShareData} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="save-history" className="font-medium">
                      Browsing History
                    </Label>
                    <p className="text-sm text-gray-500">Save your browsing history for better recommendations</p>
                  </div>
                  <Switch id="save-history" checked={saveHistory} onCheckedChange={setSaveHistory} />
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

