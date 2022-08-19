import { useEffect, useState } from 'react'
import dateFormat from 'dateformat'
import '../../styles/style.css'

function Home() {
  const [allPosts, setAllPosts] = useState([])
  const [sessionUserId, setSessionUserId] = useState(
    sessionStorage.getItem('userId')
  )

  useEffect(() => {
    setSessionUserId(sessionStorage.getItem('userId'))
  }, [sessionUserId])

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
  const [isSelected, setIsSelected] = useState(false)
  const textArea = document.getElementById('text')
  const preview = document.getElementById('imagePreview')
  const buttons = document.getElementById('postBlockButtons')
  const cancelButton = document.getElementById('cancelButton')
  const imageInput = document.getElementById('image')

  function picChange(e) {
    let src = URL.createObjectURL(e.target.files[0])
    preview.src = src
    preview.style.display = 'block'
    cancelButton.style.display = 'block'
    buttons.setAttribute('class', 'postBlock__buttons buttonsWithPreview')
    setIsSelected(true)
    setSelectedFile(e.target.files[0])
  }

  function postCancel() {
    preview.style.display = 'none'
    textArea.value = ''
    cancelButton.style.display = 'none'
    buttons.setAttribute('class', 'postBlock__buttons')
    preview.src = '#'
    imageInput.value = ''
    setIsSelected(false)
  }

  function likeAnim() {
    let heartIcon = document.querySelector('heart-icon')
    let pos = 0
    let id = setInterval(anim, 5)

    function anim() {
      if (pos > 359) {
        clearInterval(id)
      } else {
        pos = pos + 1
        heartIcon.style.transform = 'rotateY(' + pos + ')'
      }
    }
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
      console.log(postOrder)

      await fetch('http://localhost:3000/api/posts/post', postOrder)
        .then((res) => res.json())
        .catch((err) => console.log(err))
      // document.location.assign('/home')
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
      // document.location.assign('/home')
    }
  }

  async function deletePost(e, postId, postImageUrl) {
    if (
      window.confirm('Etes-vous sûr de vouloir supprimer votre publication?')
    ) {
      const imageUrl = { imageUrl: postImageUrl }
      await fetch(`http://localhost:3000/api/posts/deletePost:${postId}`, {
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
                  <div className="heart-icon" onClick={likeAnim}>
                    <i className="fa-solid fa-heart"></i>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  <p>{publish.likes}</p>
                  <p>
                    Publié le{' '}
                    {dateFormat(publish.createDate, 'dd/mm/yy à h:mm')}{' '}
                    {publish.modified === 1 ? '(Modifié)' : ''}
                  </p>
                </div>

                <div
                  className="fullPost__icons__creatorOnly"
                  style={
                    +sessionUserId === +publish.user_id
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  <i
                    className="fa-solid fa-trash-can"
                    onClick={(e) => {
                      deletePost(e, publish.id, publish.imageUrl)
                    }}
                  ></i>
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
