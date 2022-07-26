import { useEffect } from 'react'
import '../../styles/style.css'

function Home() {
  // Function called in fetch GET to display all posts in DB Table post
  function createPostsList(postsList) {
    console.log(postsList)
    const postsArray = postsList.resp
    console.log(postsArray)
    const mainContent = document.getElementById('main-content')
    for (let i = 0; i < postsArray.length; i++) {
      const userId = document.createElement('div')
      userId.textContent = `${postsArray[i].user_id}`
      mainContent.appendChild(userId)

      const postText = document.createElement('div')
      postText.textContent = `${postsArray[i].text}`
      mainContent.appendChild(postText)
    }
  }

  // GET every posts
  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then((res) => res.json())
      .then(function (postList) {
        console.log(postList)
        createPostsList(postList)
      })
      .catch((error) => console.log(error))
  }, [])

  // POST to publish a post, then reload page
  async function Post(e) {
    e.preventDefault()

    const text = document.getElementById('text').value

    const inputs = {
      userId: 9,
      text: text,
    }

    const postOrder = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
    await fetch('http://localhost:3000/api/posts/post', postOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))
    document.location.assign('/home')
  }

  return (
    <div>
      <h1 className="maintitle">Page d'accueil</h1>
      <div className="postBlock">
        <input type="text" id="text"></input>
        <input
          type="submit"
          className="button unlocked"
          value="PARTAGER"
          id="post"
          onClick={Post}
        />
      </div>
      <div className="maincontent" id="main-content"></div>
    </div>
  )
}

export default Home
