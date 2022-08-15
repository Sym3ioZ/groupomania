import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'
import '../../styles/style.css'

function Home() {
  const [allPosts, setAllPosts] = useState([])
  const [sessionUserId, setSessionUserId] = useState()
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
  }, [])

  // GET every posts
  useEffect(() => {
    const fetchPosts = async () => {
      const fetchData = await fetch('http://localhost:3000/api/posts', {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      })
      const jsonData = await fetchData.json()
      setAllPosts(jsonData.resp)
    }
    fetchPosts()
  }, [])

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()

  function picChange(e) {
    let src = URL.createObjectURL(e.target.files[0])
    let preview = document.getElementById('imagePreview')
    preview.src = src
    preview.style.display = 'block'
    setSelectedFile(e.target.files[0])
  }

  // POST method to publish a post, then reload page
  async function Post(e) {
    e.preventDefault()

    // Declaring formdata to send via fetch
    const formData = new FormData()

    formData.append('image', selectedFile)

    const text = document.getElementById('text').value
    let today = new Date()
    var createDate =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const inputs = {
      userId: 5,
      text: text,
      createDate: createDate,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)
    formData.append('createDate', inputs.createDate)

    const postOrder = {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      body: formData,
    }
    await fetch('http://localhost:3000/api/posts/post', postOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))
    document.location.assign('/home')
  }

  return (
    <div className="page">
      <div className="page__sidenav">
        <div className="profileBlock">
          <div className="profileBlock__picture">
            <img src={userProfile.profilePic} alt="profile avatar" />
          </div>
          <p className="profileBlock__name">
            {userProfile.firstName} {userProfile.name}
          </p>
        </div>
      </div>
      <div className="postBlock">
        <div className="previewBlock">
          <textarea
            className="postBlock__textarea"
            id="text"
            name="text"
            rows="3"
            cols="300"
            maxLength="500"
            placeholder="Exprimez-vous!"
            required
          ></textarea>
          <div className="picturePreview">
            <img src="#" id="imagePreview" alt="upload preview" />
          </div>
        </div>
        <label htmlFor="image" className="postBlock__imageLabel">
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
        <input
          type="submit"
          className="button unlocked"
          value="PARTAGER"
          id="post"
          onClick={Post}
        />
      </div>

      <div className="maincontent">
        {allPosts?.map((publish) => {
          return (
            <div key={`${publish.id}`} className="fullPost">
              <div className="postCard">
                <p className="postCard__user">
                  <img
                    src={publish.profilePic}
                    alt="profile avatar"
                    className="postCard__user__profilePic"
                  />{' '}
                  {publish.firstName} {publish.name} , le:{' '}
                  {dateFormat(publish.createDate, 'dd/mm/yy')}{' '}
                  {publish.modified === 1 ? '(Modifié)' : ' '} <br />
                  Secteur: {publish.sector}
                </p>
                <p className="postCard__text">{publish.text}</p>
                <div className="postCard__image">
                  <img src={publish.imageUrl} alt="postPicture" />
                </div>
              </div>
              <div className="fullPost__icons">
                <div className="heart-icon">
                  <i className="fa-solid fa-heart"></i>
                  <i className="fa-regular fa-heart"></i>
                  <p>{publish.likes}</p>
                </div>

                <div
                  className="fullPost__icons__creatorOnly"
                  style={
                    sessionUserId == publish.user_id
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  <i className="fa-solid fa-trash-can"></i>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
