import React, { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'

import { Box } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
//import CloseIcon from "@mui/icons-material/Close"
import { useOutsideClick } from "@/util"
import { AppContext } from "@/App"
import styles from './User.module.css'

const User = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const [opened, setOpened] = useState(false)
  const outsideClick = useOutsideClick(() => setOpened(false))

  const signOut = () => {
    setUser({})
    navigate('/')
  }

  return (
    <Box id="user" ref={outsideClick}>
      <div className={styles.user}>
        {Object.keys(user).length ? (
          <div className={styles.avatar} onClick={() => setOpened(true)}>
            {user.avatar 
              ? <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} loading="lazy" width={60} height={60}/>
              : <PersonIcon className={styles.default} />
            }
          </div>
        ) : (
          <Link to="/signin" className="sign-in cta-button">
            Sign in
          </Link>
        )}
      </div>

      {!!Object.keys(user).length && (
        <div className={`${[styles.account, (!!opened && styles.opened)].join(' ')}`}>
          <div className={styles.top}>
            <div className={styles.avatar}>
              {user.avatar 
                ? <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} loading="lazy" width={60} height={60}/> 
                : <PersonIcon className={styles.default} />
              }
            </div>

            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={styles.email}>{user.username}</div>
          </div>

          <ul className={styles.options}>
            <li>
              <Link to='/profile' onClick={() => setOpened(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to='/settings' onClick={() => setOpened(false)}>
                Settings
              </Link>
            </li>
            <li onClick={() => signOut()}>
              <span className={styles['sign-out']}>Sign out</span>
            </li>
          </ul>
        </div>
      )}
    </Box>
  )
}

export default User