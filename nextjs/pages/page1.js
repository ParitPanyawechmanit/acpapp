import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Import the Camera Icon

// Styled components (same as existing code)
const Sidebar = styled(Box)({
  width: "20%",
  height: "100vh",
  backgroundColor: "#ffffff",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
});

const MainContent = styled(Box)({
  width: "80%",
  padding: "30px",
  backgroundColor: "#f5f5f5",
  height: "100vh",
  overflowY: "auto",
});

const Header = styled(Box)({
  backgroundColor: "#ff5e15",
  padding: "20px",
  borderRadius: "0 0 15px 15px",
  marginBottom: "20px",
});

const Section = styled(Paper)({
  borderRadius: "15px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
});

const ProfileImage = styled(Box)({
  width: "80px",
  height: "80px",
  backgroundColor: "#e0e0e0",
  borderRadius: "50%",
  marginBottom: "20px",
  overflow: "hidden", // Hide overflow for rounded corners
  position: "relative",
  cursor: "pointer", // Change cursor to pointer on hover
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "background-color 0.3s ease", // Smooth transition
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darken background on hover
  },
});

const IconOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  color: "rgba(0, 0, 0, 0.7)", // Darker tone for the icon
  "&:hover": {
    opacity: 1, // Show icon on hover
  },
});

const ButtonContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
});

const FileInput = styled("input")({
  display: "none", // Hide the file input
});

// New styled component for the calendar placeholder
const CalendarPlaceholder = styled(Box)({
  width: "100%",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed #ff5e15",
  borderRadius: "10px",
  marginTop: "20px",
});

export default function MainLayout() {
  const router = useRouter();
  const { username, email } = router.query; // Get username and email from query params

  // State to hold the uploaded image
  const [profileImage, setProfileImage] = useState("/Group.png"); // Default image path

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setProfileImage(imageURL); // Set the uploaded image as the profile image
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h4" sx={{ color: "#ff5e15", fontWeight: "bold", mb: 3 }}>
          DEK <span style={{ color: "#FF8A65" }}>RAI</span>
        </Typography>
        {/* Profile Image Clickable for Upload */}
        <label htmlFor="image-upload">
          <FileInput
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <ProfileImage onClick={() => document.getElementById("image-upload").click()}>
            {/* Display the profile image */}
            <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" />
            {/* Overlay Icon */}
            <IconOverlay>
              <CameraAltIcon sx={{ fontSize: 30 }} />
            </IconOverlay>
          </ProfileImage>
        </label>

        {/* Display the username and email from query params */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {username || "Username"} {/* Fallback to "Username" if undefined */}
        </Typography>
        <Typography variant="body2" sx={{ mb: 4 }}>
          {email || "useremail@example.com"} {/* Fallback to "useremail@example.com" if undefined */}
        </Typography>

        {/* Navigation Buttons */}
        <ButtonContainer>
          <Button
            variant="text"
            fullWidth
            sx={{ justifyContent: "flex-start", color: activeTab === "Dashboard" ? "#ff5e15" : "#000" }}
            onClick={() => setActiveTab("Dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ justifyContent: "flex-start", color: activeTab === "My Tasks" ? "#ff5e15" : "#000" }}
            onClick={() => setActiveTab("My Tasks")}
          >
            My Tasks
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ justifyContent: "flex-start", color: activeTab === "Calendar" ? "#ff5e15" : "#000" }}
            onClick={() => setActiveTab("Calendar")}
          >
            Calendar
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ justifyContent: "flex-start", color: activeTab === "Setting" ? "#ff5e15" : "#000" }}
            onClick={() => setActiveTab("Setting")}
          >
            Setting
          </Button>
        </ButtonContainer>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Header>
          <Typography variant="h5" sx={{ color: "#fff" }}>
            Hello, {username || "User"} {/* Display username from query */}
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            Today is Monday, 23 September 2024
          </Typography>
        </Header>

        {/* Render content based on the active tab */}
        {activeTab === "Dashboard" && (
          <Section>
            <Typography variant="h6" sx={{ color: "#182b3b" }}>
              Welcome to your dashboard, {username || "User"}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Here you can find an overview of your activities and performance.
            </Typography>
          </Section>
        )}
        {activeTab === "My Tasks" && (
          <Section>
            <Typography variant="h6" sx={{ color: "#182b3b" }}>
              My Tasks
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              List of your current tasks and their status.
            </Typography>
          </Section>
        )}
        {activeTab === "Calendar" && (
          <CalendarPlaceholder>
            <Typography variant="h6" sx={{ color: "#ff5e15" }}>
              Calendar View (Coming Soon)
            </Typography>
          </CalendarPlaceholder>
        )}
        {activeTab === "Setting" && (
          <Section>
            <Typography variant="h6" sx={{ color: "#182b3b" }}>
              Settings
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Adjust your account settings and preferences here.
            </Typography>
          </Section>
        )}
      </MainContent>
    </Box>
  );
}
