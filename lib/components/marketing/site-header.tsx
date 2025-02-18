"use client";

import {
  Book,
  Briefcase,
  Code,
  Hammer,
  History,
  Menu,
  Phone,
  Sunset,
  Trees,
  UserRoundPlus,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { Button } from "@/lib/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/lib/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import Link from "next/link";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

interface MenuItem {
  title: string;
  url: string;
  subCategory?: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface Navbar1Props {
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

const SiteHeader = ({
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Invoicing",
      url: "#",
      items: [
        {
          subCategory: "Features",
          title: "Recurring Invoices",
          icon: <History className="size-5 shrink-0" />,
          url: "#",
        },
        {
          subCategory: "Support",
          title: "Contact Us",
          icon: <Phone className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/contact",
        },
        {
          title: "Terms of Service",
          icon: <Book className="size-5 shrink-0" />,
          url: "/terms",
        },
      ],
    },
    {
      title: "Use Cases",
      url: "#",
      items: [
        {
          title: "Freelancers & Self-Employed Individuals",
          icon: <UserRoundPlus className="size-5 shrink-0 mt-1" />,
          url: "/freelancers",
        },
        {
          title: "Small Business",
          icon: <Briefcase className="size-5 shrink-0 mt-2" />,
          url: "/small-business",
        },
        {
          title: "Construction & Trades",
          icon: <Hammer className="size-5 shrink-0 mt-1" />,
          url: "/construction",
        },
        {
          title: "Developers & Tech Startups",
          icon: <Code className="size-5 shrink-0 mt-1" />,
          url: "/developers",
        },
      ],
    },
    {
      title: "Pricing",
      url: "/pricing",
    },
  ],
  mobileExtraLinks = [
    { name: "Press", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Imprint", url: "#" },
    { name: "Sitemap", url: "#" },
  ],
  auth = {
    login: { text: "Log in", url: "#" },
    signup: { text: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  return (
    // the nav bar is fixed to the top of the page
    <section className="py-4 bg- opacity-100 border-b w-full">
      <div className="container mx-auto px-4">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <span className={`text-xl ${pacifico.className}`}>
                Tilly Billy
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 z-1000">
            <NavigationMenu>
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                href={"/login"}
              >
                Login
              </a>
              <a
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                href={"/signup"}
              >
                Signup
              </a>
            </NavigationMenu>
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className={`text-xl ${pacifico.className}`}>
                Tilly Billy
              </span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href="/" className="flex items-center gap-2">
                      <span className={`text-xl ${pacifico.className}`}>
                        Tilly Billy
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.text}</a>
                    </Button>
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.text}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    // Separate items into those with and without subcategories
    const categorizedItems = item.items.reduce(
      (acc, item) => {
        if (item.subCategory) {
          const category = item.subCategory;
          if (!acc.withCategory[category]) {
            acc.withCategory[category] = [];
          }
          acc.withCategory[category].push(item);
        } else {
          acc.withoutCategory.push(item);
        }
        return acc;
      },
      {
        withCategory: {} as Record<string, MenuItem[]>,
        withoutCategory: [] as MenuItem[],
      }
    );

    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="flex gap-6 p-4">
            {/* Render items with subcategories */}
            {Object.entries(categorizedItems.withCategory).map(
              ([category, items]) => (
                <div key={category} className="flex-1">
                  <div className="mb-3 text-sm font-medium text-muted-foreground">
                    {category}
                  </div>
                  <ul className="w-64">
                    {items.map((subItem) => (
                      <li key={subItem.title}>
                        <NavigationMenuLink asChild>
                          <a
                            className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                            href={subItem.url}
                          >
                            {subItem.icon}
                            <div>
                              <div className="text-sm font-semibold">
                                {subItem.title}
                              </div>
                              {subItem.description && (
                                <p className="text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {/* Render items without subcategories */}
            {categorizedItems.withoutCategory.length > 0 && (
              <div className="flex-1">
                <ul className="w-64">
                  {categorizedItems.withoutCategory.map((subItem) => (
                    <li key={subItem.title}>
                      <NavigationMenuLink asChild>
                        <a
                          className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={subItem.url}
                        >
                          {subItem.icon}
                          <div>
                            <div className="text-sm font-semibold">
                              {subItem.title}
                            </div>
                            {subItem.description && (
                              <p className="text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            )}
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { SiteHeader };
