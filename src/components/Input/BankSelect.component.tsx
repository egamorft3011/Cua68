import { useState, useMemo, useRef } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ClickAwayListener,
} from "@mui/material";

interface Bank {
  code: string;
  name: string;
}

interface BankSelectProps {
  options: Bank[];
  value: Bank | null;
  onChange: (bank: Bank | null) => void;
}

export default function BankSelect({
  options,
  value,
  onChange,
}: BankSelectProps) {
  const [query, setQuery] = useState(value?.name || "");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  const handleSelect = (bank: Bank) => {
    onChange(bank);
    setQuery(bank.name);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box position="relative">
        <TextField
          fullWidth
          placeholder="Select a bank"
          value={query}
          inputRef={inputRef}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange(null); // reset khi user gõ lại
          }}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            border: "1px solid #2A3163",
            borderRadius: 1,
            backgroundColor: "#2a3163",
            color: "white",

            "& input": { color: "white" },
          }}
        />

        {open && filtered.length > 0 && (
          <List
            sx={{
              position: "absolute",
              zIndex: 10,
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: 200,
              overflow: "auto",
              backgroundColor: "#3B4D7A",
              border: "1px solid #2A3163",
              borderTop: "none",
            }}
          >
            {filtered.map((bank) => (
              <ListItem
                key={bank.code}
                button
                onClick={() => handleSelect(bank)}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#2f3f6b" },
                }}
              >
                {bank.name}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </ClickAwayListener>
  );
}
