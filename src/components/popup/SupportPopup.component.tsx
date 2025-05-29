import React from "react";
import CustomizedDialog from "../subMenu/SubMenu.component";
import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import {
  Facebook,
  Message,
  SupportAgent,
  Telegram,
  YouTube,
} from "@mui/icons-material";
import { MenuSupport } from "@/datafake/Menu";

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
};

export default function SupportPopupComponent({
  open,
  onClose,
  title,
}: CustomizedDialogProps) {
  return (
    <CustomizedDialog open={open} onClose={onClose} title={title}>
      <MenuList>
        {MenuSupport.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              const newWindow = window.open(
                item.link,
                "_blank",
                "noopener,noreferrer"
              );
              if (newWindow) {
                newWindow.opener = null;
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </CustomizedDialog>
  );
}
