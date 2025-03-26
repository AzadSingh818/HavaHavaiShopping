// "use client"

// import { useRouter } from "next/navigation"
// import { X, Home, ShoppingBag, Heart, User, Settings, HelpCircle } from "lucide-react"
// import { useAuth } from "@/context/auth-context"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"

// interface SidebarProps {
//   open: boolean
//   onClose: () => void
// }

// // Define a type for menu items
// interface MenuItem {
//   icon: React.ComponentType<{ className?: string }>
//   label: string
//   path: string
//   requiresAuth?: boolean
// }

// export function Sidebar({ open, onClose }: SidebarProps) {
//   const { isAuthenticated } = useAuth()
//   const router = useRouter()

//   const handleNavigation = (path: string) => {
//     router.push(path)
//     onClose()
//   }

//   const menuItems: MenuItem[] = [
//     { icon: Home, label: "Home", path: "/" },
//     { icon: ShoppingBag, label: "Products", path: "/products", requiresAuth: true },
//     { icon: Heart, label: "Wishlist", path: "/wishlist", requiresAuth: true },
//     { icon: User, label: "Profile", path: "/profile", requiresAuth: true },
//     { icon: Settings, label: "Settings", path: "/settings", requiresAuth: true },
//     { icon: HelpCircle, label: "Help & Support", path: "/help" },
//   ]

//   return (
//     <>
//       {/* Overlay */}
//       {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

//       {/* Sidebar */}
//       <aside
//         className={`
//         fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
//         ${open ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0 md:static md:z-0
//       `}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold">Menu</h2>
//           <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         <ScrollArea className="h-[calc(100vh-64px)]">
//           <div className="p-4">
//             <nav className="space-y-1">
//               {menuItems.map((item) => {
//                 // Skip auth-required items if not authenticated
//                 if (item.requiresAuth && !isAuthenticated) {
//                   return null
//                 }

//                 return (
//                   <Button
//                     key={item.label}
//                     variant="ghost"
//                     className="w-full justify-start gap-3 font-normal"
//                     onClick={() => handleNavigation(item.path)}
//                   >
//                     <item.icon className="h-5 w-5" />
//                     {item.label}
//                   </Button>
//                 )
//               })}
//             </nav>

//             {!isAuthenticated && (
//               <div className="mt-8 space-y-2">
//                 <Button className="w-full" onClick={() => handleNavigation("/login")}>
//                   Login
//                 </Button>
//                 <Button variant="outline" className="w-full" onClick={() => handleNavigation("/signup")}>
//                   Sign Up
//                 </Button>
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </aside>
//     </>
//   )
// }

