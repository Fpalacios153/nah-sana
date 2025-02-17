import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from '../../store/session';

const EditUserForm = () => {
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [role, setRole] = useState(user.role || '');
  const [pronouns, setPronouns] = useState(user.pronouns || '');
  const [department, setDepartment] = useState(user.department || '');
  const [bio, setBio] = useState(user.bio || '');

  const gridStyles = {
    display: 'grid',
    gridColumnTemplate: '200px 200px',
    gap: '15px',
    padding: '6px 24px 24px 24px'
  }

  const dispatch = useDispatch();

  const onUpdateProfile = async (e) => {
    e.preventDefault();

    const data = await dispatch(updateProfile(user, firstName, lastName, role, user.image, pronouns, department, bio));
    if (data) {
      setErrors(data)
    }
  };

  return (
    <form onSubmit={onUpdateProfile} style={gridStyles}>
      <h3 style={{ gridColumn: '1 / 3' }}>My Settings</h3>
      <div style={{ gridColumn: '1 / 3' }} className="horizontal-separator" />
      {errors.length > 0 && (<div style={{ gridColumn: '1 / 3' }} className='errorContainer'>
        {errors.map((error, ind) => (
          <div key={ind} className='errorText'>{error}</div>
        ))}
      </div>)
      }
      <div className="user-settings-field">
        <label>First Name</label>
        <input
          type='text'
          name='firstName'
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        ></input>
      </div>
      <div className="user-settings-field">
        <label>Last Name</label>
        <input
          type='text'
          name='lastName'
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        ></input>
      </div>
      <div className="user-settings-field">
        <label>Pronouns</label>
        <input
          type='text'
          name='pronouns'
          onChange={(e) => setPronouns(e.target.value)}
          value={pronouns}
        ></input>
      </div>
      <div className="user-settings-field">
        <label>Role</label>
        <input
          type='text'
          name='role'
          onChange={(e) => setRole(e.target.value)}
          value={role}
        ></input>
      </div>
      <div className="user-settings-field" >
        <label>Department</label>
        <input
          type='text'
          name='department'
          onChange={(e) => setDepartment(e.target.value)}
          value={department}
        ></input>
      </div>
      <div className="user-settings-field" style={{ gridRow: '6', gridColumn: '1/3' }}>
        <label>About Me</label>
        <textarea
          type='text'
          name='bio'
          onChange={(e) => setBio(e.target.value)}
          value={bio}
          style={{ resize: 'none', height: '100px' }}
        ></textarea>
      </div>
      <div style={{ gridRow: '7', gridColumn: '2', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <button type='submit' id="save-user-changes" >
          Save Changes
        </button>
      </div>
    </form >
  );
};

export default EditUserForm;
