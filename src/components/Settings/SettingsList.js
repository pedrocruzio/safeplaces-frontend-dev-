import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SettingsList() {
  return (
    <>
      <NavLink to="/settings/organization">Configuration</NavLink>
      <NavLink to="/settings/api">Account</NavLink>
      <NavLink to="/settings/api">Publish History</NavLink>
      <NavLink to="/settings/api">Log Out</NavLink>
    </>
  );
}
