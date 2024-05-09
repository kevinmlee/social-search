import React, { useState } from "react";

import {
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import Loader from '@/components/Loader/Loader'

import styles from './Settings.module.css'

const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const validatePassword = () => {
    if (currentPassword && (newPassword === confirmNewPassword)) {
      // updateUser
    }
  }

  return (
    <Box id="settings" sx={{ padding: "0 20px" }} md={{ padding: "0 30px" }}>
      <Box>
        <Typography className="section-title" variant="h4">
          Settings
        </Typography>

        <div className={styles.group}>
          <div className={styles.description}>
            <Typography variant="h5">Basic Details</Typography>
            <p>Basic information about you. Your email address is your username.</p>
          </div>
          
          <div className={styles.settings}>
            <TextField
              id="outlined-basic"
              label="First name"
              name="firstName"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />

            <TextField
              id="outlined-basic"
              label="Last name"
              name="lastName"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              sx={{ marginTop: "10px" }}
            />

            <TextField
              id="outlined-basic"
              label="Email address"
              name="username"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => {
                setUsername(e.target.value);
                // setError("");
              }}
              value={username}
              sx={{ marginTop: "10px" }}
            />

            <Box align={'right'} sx={{ marginTop: "30px" }}>
              <button 
                className={(loading ? "loading " : "") + "cta-button"}
                data-disabled={true}
              >
                {loading ? <Loader /> : "Update details"}
              </button>
            </Box>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.description}>
            <Typography variant="h5">Password</Typography>
          </div>
          
          <div className={styles.settings}>
            <TextField
              id="outlined-basic"
              type="password"
              label="Current Password"
              name="currentPassword"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => setCurrentPassword(e.target.value)}
              value={currentPassword}
              sx={{ marginTop: "10px" }}
            />

            <TextField
              id="outlined-basic"
              type="password"
              label="New Password"
              name="newPassword"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              sx={{ marginTop: "10px" }}
            />

            <TextField
              id="outlined-basic"
              type="password"
              label="Confirm New Password"
              name="confirmNewPassword"
              variant="outlined"
              fullWidth={true}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
              sx={{ marginTop: "10px" }}
            />

            <Box align={'right'} sx={{ marginTop: "30px" }}>
              <button 
                className={(loading ? "loading " : "") + "cta-button"}
                data-disabled={true}
              >
                {loading ? <Loader /> : "Update password"}
              </button>
            </Box>
          </div>
        </div>

        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            disabled
            control={<Switch />}
            label="Disabled"
          />
        </FormGroup>
      </Box>
    </Box>
  );
}

export default Settings