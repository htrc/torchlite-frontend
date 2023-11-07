import React, { useState, useEffect } from 'react';
import { getIdplist } from 'services';
import { Grid } from '@mui/material';
import AuthLogin from './auth-forms/AuthLogin';

function AuthModal({ isOpen, onClose, csrfToken }: any) {
  const [idpList, setIdpList] = useState([]);

  // Fetch idpList from /getIdpList API when the modal is opened
  useEffect(() => {
    if (isOpen) {
      getIdplist().then((data) => setIdpList(data));
    }
  }, [isOpen]);

  return (
    // Your modal structure here
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <div className="modal-content">
          {idpList.map((idp) => (
            <div key={idp.id}>{idp.name}</div>
          ))}
        </div>
        <Grid item xs={12}>
          <AuthLogin csrfToken={csrfToken} />
        </Grid>
        <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default AuthModal;
