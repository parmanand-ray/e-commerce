import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemIcon, MenuItem } from "@mui/material";
const DeleteAction = ({ row, deleteType, handleDelete }) => {
  return (
    <MenuItem
      key="delete"
      onClick={() => handleDelete([row.original._id], deleteType)}
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;
