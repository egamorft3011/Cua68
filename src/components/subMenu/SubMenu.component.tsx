import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./SubMenu.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root-MuiDialog-paper": {
    position: "absolute",
    bottom: "50px",
    width: "100%",
    background: "#2f0f0f",
    border: "none",
    borderRadius: "24px 24px 0 0",
    color: "white",
  },
}));

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
};

const CustomizedDialog: React.FC<CustomizedDialogProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className="menu-herder-bottom-mobile"
      PaperProps={{
        style: {
          position: "absolute",
          bottom: "50px",
          width: "100%",
          background: "#2f0f0f",
          borderRadius: "24px 24px 0 0",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          textAlign: "center",
          borderBottom: "1px solid #6c3838;",
        }}
        id="customized-dialog-title"
      >
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
    </BootstrapDialog>
  );
};

export default CustomizedDialog;
