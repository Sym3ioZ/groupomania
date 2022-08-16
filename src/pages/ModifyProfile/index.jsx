import { useState, useEffect } from 'react'
import '../../styles/style.css'

function ModifyProfile() {
  //Retrieving userId and then user infos
  const [sessionUserId, setSessionUserId] = useState(
    sessionStorage.getItem('userId')
  )
  const [userProfile, setUserProfile] = useState([])
  useEffect(() => {
    setSessionUserId(sessionStorage.getItem('userId'))
    const fetchProfile = async () => {
      const fetchData = await fetch(
        `http://localhost:3000/api/auth/getProfile:${sessionUserId}`
      )
      const jsonData = await fetchData.json()
      setUserProfile(jsonData.response[0])
    }
    fetchProfile()
  }, [sessionUserId])

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState(userProfile.profilePic)

  const picChange = (e) => {
    let src = URL.createObjectURL(e.target.files[0])
    let preview = document.getElementById('profileImgPreview')
    preview.src = src
    setSelectedFile(e.target.files[0])
  }

  const picDelete = () => {}

  async function deleteProfile(e) {
    e.preventDefault()
  }
  // function to update user infos (name,mail,profilepic,...)
  async function updateProfile(e) {
    e.preventDefault()
    // Declaring formdata to send via fetch
    const formData = new FormData()
    const userId = 1
    formData.append('image', selectedFile)
    formData.append('userId', userId)
    const postOrder = {
      method: 'PUT',
      body: formData,
    }
    await fetch('http://localhost:3000/api/auth/update', postOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))
    // document.location.assign('/home')
  }
  return (
    <div className="page">
      <div className="profilePage">
        <div className="profilePage__picBlock">
          <div className="profilePage__picBlock__picture">
            <img
              src={userProfile.profilePic}
              alt="profile avatar"
              id="profileImgPreview"
            />
          </div>
          <div className="profilePage__picBlock__icons">
            <label
              htmlFor="image"
              className="profilePage__picBlock__icons__imageLabel"
            >
              <i className="fa-solid fa-image"></i>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="image"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              onChange={picChange}
            />
            <label
              htmlFor="image"
              className="profilePage__picBlock__icons__imageLabel"
            >
              <i className="fa-solid fa-trash-can"></i>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="image"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              onChange={picDelete}
            />
          </div>
        </div>
        <form className="connection-form active-form">
          <div className="form-inputs">
            <span id="errors">
              <br />{' '}
            </span>
            <div className="textarea">
              <label htmlFor="mail">Adresse mail</label>
              <input
                type="email"
                name="user_mail"
                defaultValue={userProfile.mail}
              />
              <span id="mailError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="oldpwd">Ancien mot de passe</label>
              <input
                type="password"
                name="user_oldpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
              />
              <span id="pwdError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="newpwd">Nouveau mot de passe</label>
              <input
                type="password"
                name="user_newpwd"
                minLength={8}
                maxLength={15}
                defaultValue=""
              />
              <span id="pwdError"></span>
            </div>
            <div className="textarea">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="user_name"
                defaultValue={userProfile.name}
              />
            </div>
            <div className="textarea">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="user_firstName"
                defaultValue={userProfile.firstName}
              />
            </div>
            <div className="textarea">
              <label htmlFor="bio">Bio</label>
              <textarea
                className="bioTextarea"
                id="bio"
                name="bio"
                rows="3"
                cols="300"
                maxLength="500"
                placeholder="Exprimez-vous!"
                defaultValue={userProfile.bio}
              ></textarea>
            </div>
            <div className="sectorSelect">
              <select
                name="user_sector"
                id="sector"
                className="sectorSelect__list"
              >
                <option defaultValue={userProfile.sector}>
                  {userProfile.sector}
                </option>
                <option value="direction">Direction</option>
                <option value="informatique">Informatique</option>
                <option value="comptabilité">Comptabilité</option>
                <option value="commercial">Commercial</option>
                <option value="marketing">Marketing</option>
                <option value="logistique">Logistique</option>
                <option value="rh">Ressources humaines</option>
              </select>
            </div>
          </div>
        </form>
        <div className="buttons">
          <input
            type="submit"
            className="button"
            value="METTRE A JOUR"
            id="update"
            onClick={updateProfile}
          />
          <input
            type="submit"
            className="button"
            value="SUPPRIMER"
            id="delete"
            onClick={deleteProfile}
          />
        </div>
      </div>
    </div>
  )
}

export default ModifyProfile
