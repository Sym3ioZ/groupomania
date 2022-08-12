import { useState } from 'react'
import '../../styles/style.css'

function Profile() {
  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()

  const picChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  // POST to update profilePic
  async function Post(e) {
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
    document.location.assign('/home')
  }
  return (
    <div className="page">
      <div className="profilePage">
        <input
          type="file"
          name="image"
          className="image"
          accept=".jpg, .jpeg, .png, .gif, .webp"
          onChange={picChange}
        />
        <input
          type="submit"
          className="button unlocked"
          value="MODIFIER"
          onClick={Post}
        />
      </div>
    </div>
  )
}

export default Profile
