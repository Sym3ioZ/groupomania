import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../../styles/style.css'

function UpdatePost() {
  const { publishId } = useParams()
  const [Post, setPost] = useState([])
  const [postUserId, setPostUserId] = useState(
    sessionStorage.getItem('postUserId')
  )

  const [userProfile, setUserProfile] = useState([])
  useEffect(() => {
    setPostUserId(sessionStorage.getItem('postUserId'))
    const fetchProfile = async () => {
      const fetchData = await fetch(
        `http://localhost:3000/api/auth/getProfile:${postUserId}`
      )
      const jsonData = await fetchData.json()
      setUserProfile(jsonData.response[0])
    }
    fetchProfile()
  }, [postUserId])

  // GET post to update
  useEffect(() => {
    const fetchPost = async () => {
      const fetchData = await fetch(
        `http://localhost:3000/api/posts/${publishId}`,
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
      const jsonData = await fetchData.json()
      setPost(jsonData.resp[0])
      if (jsonData.code === '401') {
        document.location.assign('/unauthorized')
      }
    }
    fetchPost()
  }, [publishId])

  // Retrieving the selected picture and post infos
  const [selectedFile, setSelectedFile] = useState()
  const [isSelected, setIsSelected] = useState(false)
  const textArea = document.getElementById('text')
  const preview = document.getElementById('picturePreview')
  const imagePreview = document.getElementById('imagePreview')
  const cancelButton = document.getElementById('cancelButton')
  const imageInput = document.getElementById('image')

  function picChange(e) {
    let src = URL.createObjectURL(e.target.files[0])
    imagePreview.src = src
    preview.style.display = 'block'
    cancelButton.style.display = 'block'
    setIsSelected(true)
    setSelectedFile(e.target.files[0])
  }

  function postCancel() {
    preview.style.display = 'none'
    textArea.value = ''
    cancelButton.style.display = 'none'
    preview.src = '#'
    imageInput.value = ''
    setIsSelected(false)
    window.history.back()
  }

  // UPDATE method to update the post, then reload home
  async function updatePost(e) {
    e.preventDefault()

    // Declaring formdata to send via fetch
    const formData = new FormData()
    const text = textArea.value
    formData.append('image', selectedFile)

    const inputs = {
      userId: sessionStorage.getItem('userId'),
      imageUrl: Post.imageUrl,
      text: text,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)
    formData.append('imageUrl', inputs.imageUrl)

    if (isSelected) {
      const postOrder = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: formData,
      }

      await fetch(
        `http://localhost:3000/api/posts/updatePost${publishId}`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      document.location.assign('/home')
    } else {
      const postOrder = {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(inputs),
      }

      await fetch(
        `http://localhost:3000/api/posts/updatePost${publishId}`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      sessionStorage.removeItem('postUserId')
      document.location.assign('/home')
    }
  }

  return (
    <div className="updatePostPage">
      <div className="fullPost" id="fullPost-postBlock">
        <div className="postCard">
          <div className="postCard__user">
            <div className="postCard__user__profile">
              <img
                src={userProfile.profilePic}
                alt="profile avatar"
                className="postCard__user__profile__pic"
              />
            </div>{' '}
            <div className="postCard__user__desc">
              <div className="postCard__user__desc__name">
                {userProfile.firstName} {userProfile.name}
              </div>
              <div className="postCard__user__desc__sector">
                Secteur: {userProfile.sector}
              </div>
            </div>
          </div>
          <div className="postBlock">
            <div className="previewBlock">
              <textarea
                className="postBlock__textarea"
                id="text"
                name="text"
                rows="3"
                maxLength="500"
                defaultValue={Post.text}
                required
              ></textarea>
              <div
                className="picturePreview"
                id="picturePreview"
                style={
                  Post.imageUrl ? { display: 'block' } : { display: 'none' }
                }
              >
                <img
                  src={Post.imageUrl}
                  id="imagePreview"
                  alt="upload preview"
                />
              </div>
            </div>
            <div className="postBlock__buttons" id="postBlockButtons">
              <label
                htmlFor="image"
                className="postBlock__buttons__imageLabel"
                id="imageLabel"
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
              <input
                type="submit"
                className="button unlocked"
                value="METTRE A JOUR"
                id="postButton"
                onClick={updatePost}
              />
              <input
                type="submit"
                className="button unlocked"
                id="cancelButton"
                style={{ display: 'block' }}
                value="ANNULER"
                onClick={postCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePost
