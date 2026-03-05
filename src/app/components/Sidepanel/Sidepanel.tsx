import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { ISidepanelProps } from "./Sidepanel.types";
import DrawerHeader from "../DrawerHeader/DrawerHeader";

const drawerWidth = 280;

const Sidepanel: React.FC<ISidepanelProps> = ({ open, onClose, children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        open={open}
        anchor="right"
        onClose={onClose}
        elevation={0}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerHeader />
        {children}
      </Drawer>
    </Box>
  );
};

export default Sidepanel;
