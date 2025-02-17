import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateAProject } from '../../../store/projects';
import { oneWorkspace } from '../../../store/workspace';
const EditProjectForm = ({ project, setShowModal }) => {

  let inputDate = ''
  if (project.dueDate) {
    inputDate = new Date(project.dueDate).toJSON().split("T")[0]
  }

  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState(project.name || '')
  const [status, setStatus] = useState(project.status || '')
  const [dueDate, setDueDate] = useState(inputDate)
  const [description, setDescription] = useState(project.description || '')
  const [buttonChange, setButtonChange] = useState('project-submit-button')

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const projects = useSelector(state => state.workspace.projects)
  const projectsArray = Object.values(projects)
  const originalName = project.name

  useEffect(() => {
    const error = []

    if (name.length > 0) {
      setButtonChange('test')
    }
    if (name.length === 0) {
      setButtonChange('project-submit-button')
    }
    projectsArray.filter(project => {
      if (project.name.toLowerCase() === name.toLowerCase() && name !== originalName) {
        error.push('Error: Project with that name already exists')
      }
    })
    setErrors(error)
  }, [name, dueDate])

  const icon = project.icon

  let ownerId = user.id
  let workspaceId = project.workspaceId

  const dispatch = useDispatch();
  const editProject = async (e) => {
    e.preventDefault();
    setHasSubmitted(true)

    if (dueDate === '') {
      setDueDate()
    }

    let payload = { id: project.id, workspaceId, name, status, dueDate, description, icon, ownerId }
    if (!errors.length) {

      const data = await dispatch(updateAProject(payload));
      await dispatch(oneWorkspace(workspaceId))

      if (data) {
        setErrors(data)
      }
    }
  };

  return (
    <>
      <div className='project-create-form-container'>
        <div className='project-top-container'>
          <h2>Edit Project</h2>
          <button className="create-button" onClick={() => setShowModal(false)}>X</button>
        </div>
        <form onSubmit={editProject}>
          {hasSubmitted && errors.length > 0 && (<div className='errorContainer project-errors'>
            {errors.map((error, ind) => (
              <div key={ind} className='errorText'>{error.split(":")[1]}</div>
            ))}
          </div>)}
          <div className='form-container-pull-down'>

            <div className='project-input-container'>
              <label className='project-input-label'>Project Name</label>
              <input
                maxLength={25}
                type='text'
                name='name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your project name"
              ></input>
            </div>
            <div className='project-input-container'>
              <label className='project-input-label'>Status</label>
              <select
                className='project-select-class'
                name='status'
                onChange={(e) => setStatus(e.target.value)}
                value={status}>
                <option className='project-option' value="On Track">
                  On Track
                </option>
                <option value="At Risk">
                  At Risk
                </option>
                <option value="Off Track">
                  Off Track
                </option>
                <option value="On Hold">
                  On Hold
                </option>
                <option value="Complete">
                  Complete
                </option>
              </select>
            </div>
            <div className='project-input-container'>
              <label className='project-input-label'>Due Date</label>
              <input
                type='date'
                name='dueDate'
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
              ></input>
            </div>
            <div className='project-input-container'>
              <label className='project-input-label'>Description</label>
              <textarea
                className='text-area-style'
                type='text'
                name='description'
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Add a description of your project here (Optional)"
              ></textarea>
            </div>
          </div>
          <div className='project-input-container move-button-down'>
            <button className={`${buttonChange}`} type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProjectForm;
