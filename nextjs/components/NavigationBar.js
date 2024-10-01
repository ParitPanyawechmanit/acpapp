import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import FunctionsIcon from "@mui/icons-material/Functions";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";
// Import the logo image
import logo from "/public/logo.png"; // Adjust the path based on your project structure
import logo1 from "/public/logo2.png";
const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#FFD737" }}>
        <Toolbar>
          {/* Display the logo */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/")}>
            <Image src={logo} alt="Logo" width={45} height={60} />
          </Box>
          <Typography
            variant="body"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#000000",
              padding: "0 10px",
              fontFamily: "Font",
            }}
          >
          {appName}
          </Typography>
          <NavigationLink href="/page1" label="Home" />
          <div style={{ flexGrow: 1 }} />
          <Button
            sx={{ color: "#ffffff" }}
            onClick={() => {
              router.push("/register");
            }}
          >
            <PersonIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px", // Add padding on left and right
        }}
      >
        {label}
      </Typography>
    </Link>
  );
};

export default NavigationLayout;
