import React, { useContext, useState } from "react"
import { Link } from 'react-router-dom'

import { Box } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
//import CloseIcon from "@mui/icons-material/Close"
import { useOutsideClick } from "@/util"
import { AppContext } from "@/App"

const User = () => {
  const { user, setUser } = useContext(AppContext)
  const [opened, setOpened] = useState(false)
  const outsideClick = useOutsideClick(() => setOpened(false))

  const signOut = () => {
    setUser({})
    window.location.href = "/"
  }

  return (
    <Box id="user" ref={outsideClick}>
      <div className="user">
        {Object.keys(user).length ? (
          <div className="avatar" onClick={() => setOpened(true)}>
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`}/>
            ) : (
              <PersonIcon className="default" />
            )}
          </div>
        ) : (
          <Link to="/signin" className="sign-in cta-button">
            Sign in
          </Link>
        )}
      </div>

      {!!Object.keys(user).length && (
        <div className={"account " + (!!opened && "opened")}>
          <div className="top">
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`}/>
              ) : (
                <PersonIcon className="default" />
              )}
            </div>

            <div className="name">{`${user.firstName} ${user.lastName}`}</div>
            <div className="email">{user.username}</div>
          </div>

          <ul className="options">
            <li>
              <span>Profile</span>
            </li>
            <li>
              <span>Settings</span>
            </li>
            <li onClick={() => signOut()}>
              <span className="sign-out">Sign out</span>
            </li>
          </ul>
        </div>
      )}
    </Box>
  )
}

export default User