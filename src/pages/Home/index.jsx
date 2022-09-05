import { useEffect, useState, useReducer } from 'react'
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'
import '../../styles/style.css'

function Home() {
  const [allPosts, setAllPosts] = useState([])
  const [likes, setLikes] = useState([])
  const [update, forceUpdate] = useReducer((x) => x + 1, 0)
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

  // GET every posts and likes table
  useEffect(() => {
    const fetchPosts = async () => {
      const fetchData = await fetch('http://localhost:3000/api/posts', {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      })
      const jsonData = await fetchData.json()
      setAllPosts(jsonData.resp)
      if (jsonData.code === '401') {
        document.location.assign('/unauthorized')
      }
    }

    const fetchLikes = async () => {
      const fetchData = await fetch(
        'http://localhost:3000/api/posts/getLikes',
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
      const jsonData = await fetchData.json()
      setLikes(jsonData.resp)
      if (jsonData.code === '401') {
        document.location.assign('/unauthorized')
      }
    }
    fetchPosts()
    fetchLikes()
  }, [update])

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()
  const [isSelected, setIsSelected] = useState(false)
  const textArea = document.getElementById('text')
  const preview = document.getElementById('picturePreview')
  const imagePreview = document.getElementById('imagePreview')
  const cancelButton = document.getElementById('cancelButton')
  const imageInput = document.getElementById('image')

  function checkLikes(publishId) {
    let likesCounter = 0
    if (likes.length > 0) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].post_id === publishId) {
          likesCounter++
        }
      }
    }
    return likesCounter
  }

  function checkUserLiked(publishId) {
    let checkStatus = false
    if (likes.length > 0) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].post_id === publishId) {
          if (likes[i].user_id === userProfile.userId) {
            checkStatus = true
          }
        }
      }
    }
    return checkStatus
  }

  function heartClick(publishId) {
    const putOrder = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({ userId: userProfile.userId, postId: publishId }),
    }

    fetch('http://localhost:3000/api/posts/likePost', putOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))

    document.getElementById(`${publishId}heartIcon`).style.animation =
      'heart-click 500ms ease-in-out both 1'
    forceUpdate()
    window.setTimeout(() => {
      document.getElementById(`${publishId}heartIcon`).style.animation = ''
    }, '500')
  }

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
  }

  // POST method to publish a post, then reload page
  async function Post(e) {
    e.preventDefault()

    // Declaring formdata to send via fetch
    const formData = new FormData()
    const text = textArea.value
    formData.append('image', selectedFile)

    let today = new Date()
    let createDate =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate() +
      '-' +
      today.getHours() +
      ':' +
      today.getMinutes()
    const inputs = {
      userId: sessionStorage.getItem('userId'),
      text: text,
      createDate: createDate,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)
    formData.append('createDate', inputs.createDate)

    if (isSelected) {
      const postOrder = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: formData,
      }

      await fetch('http://localhost:3000/api/posts/post', postOrder)
        .then((res) => res.json())
        .catch((err) => console.log(err))
      document.location.assign('/home')
    } else {
      const postOrder = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(inputs),
      }
      console.log(postOrder)

      await fetch('http://localhost:3000/api/posts/post', postOrder)
        .then((res) => res.json())
        .catch((err) => console.log(err))
      document.location.assign('/home')
    }
  }

  async function deletePost(e, publishId, postImageUrl) {
    if (
      window.confirm('Etes-vous sûr de vouloir supprimer votre publication?')
    ) {
      const imageUrl = { imageUrl: postImageUrl }
      await fetch(`http://localhost:3000/api/posts/deletePost:${publishId}`, {
        method: 'DELETE',
        body: JSON.stringify(imageUrl),
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
      document.location.assign('/home')
    }
  }

  return (
    <div className="page">
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
                placeholder="Exprimez-vous!"
                required
              ></textarea>
              <div className="picturePreview" id="picturePreview">
                <img src="#" id="imagePreview" alt="upload preview" />
              </div>
            </div>
            <div className="postBlock__buttons" id="postBlockButtons">
              <label htmlFor="image" className="postBlock__buttons__imageLabel">
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
              <input
                type="submit"
                className="button unlocked"
                id="cancelButton"
                value="ANNULER"
                onClick={postCancel}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="maincontent">
        {allPosts?.map((publish) => {
          return (
            <div key={`${publish.id}`} className="fullPost">
              <div className="postCard">
                <div className="postCard__user">
                  <div className="postCard__user__profile">
                    <img
                      src={publish.profilePic}
                      alt="profile avatar"
                      className="postCard__user__profile__pic"
                    />
                  </div>{' '}
                  <div className="postCard__user__desc">
                    <div className="postCard__user__desc__name">
                      {publish.firstName} {publish.name}
                    </div>
                    <div className="postCard__user__desc__sector">
                      Secteur: {publish.sector}
                    </div>
                  </div>
                </div>
                <p className="postCard__text">{publish.text}</p>
                <div
                  className={
                    publish.imageUrl
                      ? 'postCard__image'
                      : 'postCard__image__off'
                  }
                >
                  <img src={publish.imageUrl} alt="postPicture" />
                </div>
              </div>
              <div className="fullPost__icons">
                <div className="fullPost__icons__heartBlock">
                  <div className="fullPost__icons__heartBlock__icon">
                    <div className="heart-icon" id={`${publish.id}heartIcon`}>
                      <i
                        className={
                          checkUserLiked(publish.id)
                            ? 'fa-regular fa-heart regularOFF'
                            : 'fa-regular fa-heart'
                        }
                        id={`${publish.id}regularHeartIcon`}
                      ></i>
                      <i
                        className={
                          checkUserLiked(publish.id)
                            ? 'fa-solid fa-heart solidON'
                            : 'fa-solid fa-heart'
                        }
                        id={`${publish.id}solidHeartIcon`}
                        onClick={() => heartClick(publish.id)}
                      ></i>
                    </div>
                  </div>
                  <p id="likesCount">{checkLikes(publish.id)}</p>
                  <p>
                    Publié le{' '}
                    {dateFormat(publish.createDate, 'dd/mm/yy à HH:MM')}{' '}
                    {publish.modified === 1 ? '(Modifié)' : ''}
                  </p>
                </div>

                <div
                  className="fullPost__icons__creatorOnly"
                  style={
                    +sessionUserId === +publish.user_id ||
                    userProfile.role === 'admin'
                      ? { display: 'flex' }
                      : { display: 'none' }
                  }
                >
                  <Link to={`/updatePost:${publish.id}`}>
                    <i
                      className="fa-solid fa-pen-to-square"
                      id="modifyIcon"
                      onClick={(e) => {
                        sessionStorage.setItem('postUserId', publish.user_id)
                      }}
                    ></i>
                  </Link>

                  <div>
                    <i
                      className="fa-solid fa-trash-can"
                      id="deleteIcon"
                      onClick={(e) => {
                        deletePost(e, publish.id, publish.imageUrl)
                      }}
                    ></i>
                  </div>
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
