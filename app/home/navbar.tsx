"use client";
import { useEffect, memo } from "react";
import clsx from "clsx";
import NextLink from "next/link";
import {
  User,
  Avatar,
  Link,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { useSet } from "@/utils/hooks";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import { getCurrUserAvatarUrl } from "@/utils";

export default memo(() => {
  const { userInfo } = useGlobalState();
  const [state, setState] = useSet({
    isLogin: false,
  });

  const { isLogin } = state;

  useEffect(() => {
    const _token = localStorage.getItem("token");
    setState({
      isLogin: _token && _token !== "undefined",
    });
  }, []);

  return (
    <Navbar
      className="w-[95%] max-w-[1440px] mx-auto z-40 shadow-sm rounded-xl border border-gray-150 mt-8 justify-between"
      position="static"
      height={56}
      maxWidth="full"
    >
      <NavbarBrand>
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <Logo />
          <p className="font-medium text-inherit ml-1">Indieapp</p>
        </NextLink>
      </NavbarBrand>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        {siteConfig.navItems.map((item) => (
          <NavbarItem key={item.href} className="mr-12">
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isLogin ? (
          <Link href="/mine/projects">
            <Avatar
              isBordered
              className="w-[34px] h-[34px]"
              src={getCurrUserAvatarUrl(userInfo)}
            />
          </Link>
        ) : (
          <NavbarItem className="hidden md:flex">
            <Button
              size="sm"
              className="text-sm font-normal bg-transfrom border border-gray-300"
              variant="flat"
              onPress={() => window.dispatchEvent(new CustomEvent("SkipLogin"))}
            >
              sign in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
});
