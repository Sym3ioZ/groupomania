import { useEffect, useState, useReducer } from 'react'
import dateFormat from 'dateformat'
import '../../styles/style.css'

function Home() {
  const [allPosts, setAllPosts] = useState([])
  const [likes, setLikes] = useState([])
  const [update, forceUpdate] = useReducer((x) => x + 1, 0)
  const sessionUserId = sessionStorage.getItem('userId')

  const [userProfile, setUserProfile] = useState([])

  // Retrieving user profile on component load
  useEffect(() => {
    const fetchProfile = async () => {
      const fetchData = await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/auth/getProfile:${sessionUserId}`
      )
      const jsonData = await fetchData.json()
      setUserProfile(jsonData.response[0])
    }
    fetchProfile()
  }, [sessionUserId])

  // GET every posts and likes
  useEffect(() => {
    const fetchPosts = async () => {
      const fetchData = await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts`,
        {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
      const jsonData = await fetchData.json()
      setAllPosts(jsonData.resp)
      if (jsonData.code === '401') {
        document.location.assign('/unauthorized')
      }
    }

    const fetchLikes = async () => {
      const fetchData = await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/getLikes`,
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

  // Retrieving the selected picture and the post block elements
  const [selectedFile, setSelectedFile] = useState()
  const [selectedUpdateFile, setSelectedUpdateFile] = useState()
  const [isSelected, setIsSelected] = useState(false)
  const [isUpdateSelected, setIsUpdateSelected] = useState(false)
  const textArea = document.getElementById('text')
  const preview = document.getElementById('picturePreview')
  const imagePreview = document.getElementById('imagePreview')
  const cancelButton = document.getElementById('cancelButton')
  const imageInput = document.getElementById('image')

  // Function to count the number of likes on each post displayed in the page
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

  // Function to check if the connected user has already liked the post
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

  // Function to handle the click on the like icon
  function heartClick(publishId) {
    const putOrder = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({ userId: sessionUserId, postId: publishId }),
    }

    fetch(
      `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/likePost`,
      putOrder
    )
      .then((res) => res.json())
      .catch((err) => console.log(err))

    document.getElementById(`${publishId}heartIcon`).style.animation =
      'heart-click 650ms ease-in-out both 1'
    forceUpdate()
    window.setTimeout(() => {
      document.getElementById(`${publishId}heartIcon`).style.animation = ''
    }, '650')
  }

  // Function to zoom in the post images
  function enlargePicture(publishImageUrl) {
    let zoom = document.getElementById('zoom')
    let zoomImage = document.getElementById('zoomImage')

    zoom.style.display = 'block'
    zoomImage.src = publishImageUrl
    let zoomClose = document.getElementById('zoomClose')

    zoomClose.onclick = function () {
      zoom.style.display = 'none'
    }
  }

  // Function to handle the selection of an image, and display it in a preview block
  function picChange(e) {
    let src = URL.createObjectURL(e.target.files[0])
    imagePreview.src = src
    preview.style.display = 'block'
    cancelButton.style.display = 'block'
    setIsSelected(true)
    setSelectedFile(e.target.files[0])
  }

  // Function to handle the selection of an image while updating a post, and display it in a preview block
  function updatePicChange(e, publishId) {
    const updatePreview = document.getElementById(
      `${publishId}updatePicturePreview`
    )
    const updateImagePreview = document.getElementById(
      `${publishId}updateImagePreview`
    )
    let src = URL.createObjectURL(e.target.files[0])
    updateImagePreview.src = src
    updatePreview.style.display = 'block'
    setIsUpdateSelected(true)
    setSelectedUpdateFile(e.target.files[0])
  }

  // Function to cancel the post the user was preparing to publish
  function postCancel() {
    preview.style.display = 'none'
    textArea.value = ''
    cancelButton.style.display = 'none'
    preview.src = '#'
    imageInput.value = ''
    setIsSelected(false)
  }

  // Function to cancel the update of a post
  function updatePostCancel(e, publishId, publishImageUrl, publishText) {
    e.preventDefault()
    const updatePreview = document.getElementById(
      `${publishId}updatePicturePreview`
    )
    const updateImagePreview = document.getElementById(
      `${publishId}updateImagePreview`
    )
    const updateText = document.getElementById(`${publishId}updateText`)
    updateImagePreview.src = publishImageUrl
    updatePreview.style.display = 'none'
    updateText.value = publishText
    setIsUpdateSelected(false)
    document.getElementById(`${publishId}updateBlock`).style.display = 'none'
  }

  // Function to publish a post
  async function Post(e) {
    e.preventDefault()

    // Declaring FormData to send via fetch (especially for the image)
    const formData = new FormData()
    const text = textArea.value
    formData.append('image', selectedFile)

    // Formatting the creation date to store in the DB
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
      userId: sessionUserId,
      text: text,
      createDate: createDate,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)
    formData.append('createDate', inputs.createDate)

    if (isSelected) {
      // If an image file is added to the post, then sending the whole formdata
      const postOrder = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: formData,
      }

      await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/post`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      postCancel()
      forceUpdate()
    } else {
      // If there is no image added, just sending the inputs (userId, text, creteDate)
      const postOrder = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(inputs),
      }

      await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/post`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      postCancel()
      forceUpdate()
    }
  }

  // Function to delete a post
  async function deletePost(e, publishId, publishImageUrl) {
    if (
      window.confirm('Etes-vous sûr de vouloir supprimer votre publication?')
    ) {
      const reqBody = { userId: sessionUserId, imageUrl: publishImageUrl }
      await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/deletePost:${publishId}`,
        {
          method: 'DELETE',
          body: JSON.stringify(reqBody),
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      forceUpdate()
    }
  }

  // Displaying the update block
  function displayUpdateBlock(publishId, publishImageUrl) {
    document.getElementById(`${publishId}updateBlock`).style.display = 'flex'
    if (publishImageUrl) {
      document.getElementById(
        `${publishId}updatePicturePreview`
      ).style.display = 'block'
    }
  }

  // UPDATE method to update the post, then reload home
  async function updatePost(e, publishId, publishImageUrl) {
    e.preventDefault()

    // Declaring formdata to send via fetch
    const formData = new FormData()
    const text = document.getElementById(`${publishId}updateText`).value
    formData.append('image', selectedUpdateFile)

    const inputs = {
      userId: sessionUserId,
      imageUrl: publishImageUrl,
      text: text,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)
    formData.append('imageUrl', inputs.imageUrl)

    if (isUpdateSelected) {
      const postOrder = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: formData,
      }

      await fetch(
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/updatePost${publishId}`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      setIsUpdateSelected(false)
      document.getElementById(`${publishId}updateBlock`).style.display = 'none'
      forceUpdate()
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
        `http://localhost:${process.env.REACT_APP_PORT_API}/api/posts/updatePost${publishId}`,
        postOrder
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
      setIsUpdateSelected(false)
      document.getElementById(`${publishId}updateBlock`).style.display = 'none'
      forceUpdate()
    }
  }

  return (
    <div className="page">
      <div className="fullPost" id="fullPost-postBlock">
        {' '}
        {
          // Displaying the post block with preview
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
                <label
                  htmlFor="image"
                  className="postBlock__buttons__imageLabel"
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
        }
      </div>

      <div className="maincontent">
        {allPosts?.map((publish) => {
          // Mapping all posts to display them with the same structure
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
                  onClick={() => enlargePicture(publish.imageUrl)}
                >
                  <img src={publish.imageUrl} alt="postPicture" />
                </div>
                <div id="zoom" className="zoom">
                  <span className="zoom__close" id="zoomClose">
                    <i className="fa-solid fa-circle-xmark"></i>
                    Fermer
                  </span>
                  <img
                    className="zoom__content"
                    id="zoomImage"
                    alt="postPicture zoomed"
                  />
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
                  <i
                    className="fa-solid fa-pen-to-square"
                    id="modifyIcon"
                    onClick={() =>
                      displayUpdateBlock(publish.id, publish.imageUrl)
                    }
                  ></i>
                  {/* Update block */}
                  <div className="updateBlock" id={`${publish.id}updateBlock`}>
                    <div
                      className="fullPost"
                      id={`${publish.id}fullPost-postBlock`}
                    >
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
                        <div className="postBlock">
                          <div className="previewBlock">
                            <textarea
                              className="postBlock__textarea"
                              id={`${publish.id}updateText`}
                              name="text"
                              rows="3"
                              maxLength="500"
                              defaultValue={publish.text}
                              required
                            ></textarea>
                            <div
                              className="picturePreview"
                              id={`${publish.id}updatePicturePreview`}
                              style={
                                publish.imageUrl
                                  ? { display: 'block' }
                                  : { display: 'none' }
                              }
                            >
                              <img
                                className="imagePreview"
                                src={publish.imageUrl}
                                id={`${publish.id}updateImagePreview`}
                                alt="upload preview"
                              />
                            </div>
                          </div>
                          <div
                            className="postBlock__buttons"
                            id={`${publish.id}postBlockButtons`}
                          >
                            <label
                              htmlFor={`${publish.id}image`}
                              className="postBlock__buttons__imageLabel"
                              id={`${publish.id}imageLabel`}
                            >
                              <i className="fa-solid fa-image"></i>
                            </label>
                            <input
                              type="file"
                              name={`${publish.id}image`}
                              id={`${publish.id}image`}
                              className="image"
                              accept=".jpg, .jpeg, .png, .gif, .webp"
                              onChange={(e) => {
                                updatePicChange(e, publish.id)
                              }}
                            />
                            <input
                              type="submit"
                              className="button unlocked"
                              value="METTRE A JOUR"
                              id={`${publish.id}postButton`}
                              onClick={(e) => {
                                updatePost(e, publish.id, publish.imageUrl)
                              }}
                            />
                            <input
                              type="submit"
                              className="button unlocked"
                              id={`${publish.id}cancelButton`}
                              style={{ display: 'block' }}
                              value="ANNULER"
                              onClick={(e) =>
                                updatePostCancel(
                                  e,
                                  publish.id,
                                  publish.imageUrl,
                                  publish.text
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
